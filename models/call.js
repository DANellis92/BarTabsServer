module.exports = function(sequelize, DataTypes) {
  return sequelize.define("call", {
    grabber: DataTypes.STRING,
    description: DataTypes.STRING,
    duration: DataTypes.STRING,
    owner: DataTypes.INTEGER
  });
};
