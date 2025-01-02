import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';

@Model()
export class UtilsModel {
  public decodedJwt: jwt.Jwt | null = null;
  public rawJwt: string = '';

  public init() { }

  @Action()
  public decodeJwt(jwtString: string) {
    this.rawJwt = jwtString;
    this.decodedJwt = jwt.decode(jwtString, { complete: true, json: true });
  }
}

const [UtilsContext, useUtilsModel] = connect(UtilsModel);

export { UtilsContext, useUtilsModel };