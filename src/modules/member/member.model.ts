import crypto from "crypto";
import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { getBrgyName, getCityName } from "../../utils/locationCache";
import { User } from "../user/user.model";
export class Member extends Model {
  declare id: number;
  declare membershipId: string;
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
  declare readonly permanentCityName: string;

  static associate(models: any) {
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
      type: DataTypes.UUID,
      allowNull: false,
    },
    membershipId: {
      type: DataTypes.STRING,
      unique: true,
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
    permanentCityName: {
      type: DataTypes.VIRTUAL,
      get() {
        const cityCode = this.getDataValue("permanentCity");
        return getCityName(cityCode);
      },
    },
    permanentBarangayName: {
      type: DataTypes.VIRTUAL,
      get() {
        const brgyCode = this.getDataValue("permanentBarangay");
        return getBrgyName(brgyCode);
      },
    },
    currentCityName: {
      type: DataTypes.VIRTUAL,
      get() {
        const cityCode = this.getDataValue("currentCity");
        return getCityName(cityCode);
      },
    },
    currentBarangayName: {
      type: DataTypes.VIRTUAL,
      get() {
        const brgyCode = this.getDataValue("currentBarangay");
        return getBrgyName(brgyCode);
      },
    },
  },
  {
    sequelize,
    modelName: "member",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
    hooks: {
      beforeValidate: (member, options) => {
        if (!member.membershipId) {
          const year = new Date().getFullYear() % 100;
          const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
          member.membershipId = `MEM-${year}-${randomStr}`;
        }
      },
    },
  }
);
