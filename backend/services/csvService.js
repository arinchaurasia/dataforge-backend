const fs = require("fs");
const csv = require("csv-parser");

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const validData = [];
    const invalidData = []; 

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const isEmpty = Object.values(row).every(val => !val || val.trim() === "");
        if (isEmpty) return;

        const empId = row.empId?.trim() || row.id?.trim() || "N/A";
        const name = row.name?.trim() || null;
        const email = row.email?.trim() || "";
        const age = row.age ? Number(row.age) : null;
        const gender = row.gender?.trim() || row.sex?.trim() || "Other";
        const city = row.city?.trim() || "Unknown";
        const salary = row.salary ? Number(row.salary) : 0;
        const role = row.role?.trim() || "Not Specified";
        const skills = row.skills?.trim() || "Not Specified";

        // 🔍 Track specific reasons for "Improper" status
        const reasons = [];
        if (!name) reasons.push("Missing Name");
        if (!email.includes("@")) reasons.push("Invalid Email");
        if (isNaN(age) || age === null || age <= 0) reasons.push("Invalid Age");

        const isImproper = reasons.length > 0;

        const cleaned = {
          empId,
          name: name || "Unspecified",
          gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
          email: email || "missing",
          age: isNaN(age) || age === null ? 0 : age,
          city,
          role,
          skills,
          salary: isNaN(salary) ? 0 : salary,
          isImproper,
          reason: reasons.join(", ") // 🎯 Fix: Preserving the "Why"
        };

        validData.push(cleaned);
      })
      .on("end", () => {
        resolve({ validData, invalidData });
      })
      .on("error", reject);
  });
};

module.exports = processCSV;
