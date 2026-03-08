import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { User } from "../user/user.model";

export class Member extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare middleName: string;
  declare email?: string | null;
  declare phone?: string | null;
  declare tinNo?: string | null;
  declare rsbsaNo?: string | null;
  declare permanentAddress1: string;
  declare permanentAddress2?: string | null;
  declare permanentBarangay: string;
  declare permanentCity: string;
  declare currentAddress1: string;
  declare currentAddress2?: string | null;
  declare currentBarangay: string;
  declare currentCity: string;
  declare photoUrl?: string | null;
  declare validIdUrl?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  static associate(models: any) {
    console.log(12344, models);

    Member.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tinNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rsbsaNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentAddress1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permanentAddress2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentBarangay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permanentCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentAddress1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentAddress2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentBarangay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validIdUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "member",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
  }
);
