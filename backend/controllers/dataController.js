const processCSV = require("../services/csvService");
const Data = require("../models/Data");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

const buildFilter = (userId, query) => {
  const { field, value, q } = query;
  const filter = { userId: new mongoose.Types.ObjectId(userId) };

  if (q) {
    const searchRegex = { $regex: q, $options: 'i' };
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { city: searchRegex },
      { role: searchRegex },
      { skills: searchRegex },
      { empId: searchRegex },
      { gender: { $regex: `^${q}`, $options: 'i' } } // 🎯 Fix: Prevent 'male' matching 'female'
    ];
  } else if (field && value) {
    if (field === 'gender') {
      // For gender, we want to match from the start to avoid 'male' matching 'female'
      filter[field] = { $regex: `^${value}`, $options: 'i' };
    } else {
      filter[field] = { $regex: value, $options: 'i' };
    }
  }

  return filter;
};

exports.uploadCSV = async (req, res) => {
  try {
    const { validData } = await processCSV(req.file.path);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    if (req.query.clearPrevious === 'true') {
      await Data.deleteMany({ userId });
    }

    const dataWithUser = validData.map(row => ({
      ...row,
      userId
    }));

    if (dataWithUser.length > 0) {
      await Data.insertMany(dataWithUser);
    }

    const io = req.app.get('io');
    if (io) io.emit('dataUpdated');

    res.json({
      message: "Data processed successfully",
      total: validData.length,
      improper: validData.filter(d => d.isImproper).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getValidData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;
    const filter = buildFilter(req.user.id, req.query);

    const total = await Data.countDocuments(filter);
    const data = await Data.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const filter = buildFilter(req.user.id, req.query);
    const data = await Data.find(filter).lean();

    if (data.length === 0) {
      return res.status(404).json({ error: "No data to export" });
    }

    const cleanedData = data.map(({ _id, userId, __v, createdAt, updatedAt, isImproper, ...rest }) => rest);
    
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(cleanedData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`dataforge_export_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const total = await Data.countDocuments({ userId });
    const improperCount = await Data.countDocuments({ userId, isImproper: true });

    const score = total ? Math.round(((total - improperCount) / total) * 100) : 100;

    // 🎯 Fix: Aggregate Reasons for "Why Health?"
    const issueBreakdown = await Data.aggregate([
        { $match: { userId, isImproper: true } },
        { $group: { _id: "$reason", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const topCity = await Data.aggregate([
        { $match: { userId } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const topRole = await Data.aggregate([
        { $match: { userId } },
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const maxSalary = await Data.aggregate([
        { $match: { userId } },
        { $group: { _id: null, max: { $max: "$salary" } } }
    ]);

    res.json({
      total,
      valid: total - improperCount,
      invalid: improperCount,
      qualityScore: score,
      issueBreakdown, // 🎯 Fix: Sending the "Why" to frontend
      insights: {
          highestSalary: maxSalary[0]?.max || 0,
          topCity: topCity[0]?._id || "N/A",
          topRole: topRole[0]?._id || "N/A"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUserData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await Data.deleteMany({ userId });
    const io = req.app.get('io');
    if (io) io.emit('dataUpdated');
    res.json({ message: "All user data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAverageSalary = async (req, res) => {
  try {
    const result = await Data.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, avgSalary: { $avg: "$salary" } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupedStats = async (req, res) => {
  try {
    const { groupBy = 'city' } = req.query;
    const result = await Data.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: `$${groupBy}`,
          count: { $sum: 1 },
          totalSalary: { $sum: "$salary" },
          avgSalary: { $avg: "$salary" }
        }
      },
      { $sort: { totalSalary: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
