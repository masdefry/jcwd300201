import { Request,Response,NextFunction } from "express"

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //   const id = nanoid(8);
    //   const dateNow = addHours(new Date(), 7);
    //   const verificationCode = nanoid(6);
  
    //   const date = `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`;
    //   const refferal = `TBX-${id}-${date}`;
  
    //   const { firstName, lastName, email, password, phoneNumber, identityNumber, referralBody /* REFERRAL BOLEH NULL */ } = req.body;
    //   if (!firstName || !lastName || !email || !password || !phoneNumber || !identityNumber) throw { msg: 'Harap diisi terlebih dahulu', status: 406 };
  
    //   res.status(201).json({
    //     error: false,
    //     message: 'Berhasil membuat data, silahkan cek email untuk verifikasi.',
    //     data: { firstName, lastName, email, phoneNumber },
    //   });
    // } catch (error) {
    //   next(error);
    // }
  }