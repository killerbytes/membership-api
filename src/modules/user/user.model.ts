import bcrypt from "bcrypt";
import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { Member } from "../member/member.model";

export class User extends Model {
  declare id: number;
  declare email?: string | null;
  declare mobile?: string | null;
  declare password?: string;
  declare role: "admin" | "user";
  declare status: "active" | "inactive";
  declare lastLoginAt?: Date | null;
  declare refreshToken?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  static associate(models: any) {
    User.hasOne(Member, {
      foreignKey: "userId",
      as: "member",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isMobilePhone: "any",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "user",
    defaultScope: {
      attributes: { exclude: ["password", "refreshToken", "deletedAt"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);
