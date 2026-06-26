import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

declare global{
    namespace Express{
        interface Request{
            user?:{
                email:string,
                name:string,
                id:string,
                role:Role
            }
        }
    }
}

router.post("/register", userController.createUser);
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const verifiedToken = jwtUtils.verifiedToken(
      accessToken,
      config.jwt_access_secret,
    );
    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }
    const { email, name, id, role } = verifiedToken;

    // const requiredRoles=['ADMIN',"USER","AUTHOR"];
    const requiredRoles = [Role.ADMIN, Role.USER];

    if (!requiredRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Forbiden",
      });
    }
    req.user={
        email,
        name,
        id,
        role
    }

    next();
  },
  userController.getMyProfile,
);

export const UserRoutes = router;
