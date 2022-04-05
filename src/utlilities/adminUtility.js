const { A1 } = require('../config');

exports.adminData = (req) => {
  req.body.isVerified = true;
  req.body.isApproved = true;
  req.body.role = A1;
  return req.body;
};

exports.fieldsToShow = (req) => {
  if (req.query.fields) {
    const arrayField = req.query.fields.toString();
    const arr = arrayField.split(',').filter((element) => element);
    let fields = {password:0};
    arr.map((i) => {
      fields[i] = 1;
    });
    return fields;
  } else {
    const fields = {
      id:1,
      role: 1,
      fullName: 1,
      email: 1,
      phoneNumber: 0,
      isVerified: 1,
      isApprove: 1,
    };
    return fields;
  }
};
exports.sortByField = (req) => {
  if (req.query.sort) {
    let sort = {};
    values = new Object(req.query.sort);
    //    for()
    return sort;
  } else {
    const sort = { createdAt: -1 };
    return sort;
  }
};
