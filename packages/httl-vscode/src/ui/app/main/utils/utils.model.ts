import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";

@Model()
export class UtilsModel {
  private static readonly STORE_JWT_KEY = 'utils-jwt-decode';

  public decodedJwt: jwt.Jwt | string | null = null;
  public rawJwt: string = '';

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.rawJwt = (appData as any)[UtilsModel.STORE_JWT_KEY] ?? '';
  }

  @Action()
  public decodeJwt(jwtString: string) {
    if (!jwtString) {
      this.clearJwt();
      return;
    }
    
    this.setJwt(jwtString);
    this.decodedJwt = jwt.decode(jwtString, { complete: true, json: true }) ?? "Invalid JWT";
  }

  @Action()
  public clearJwt() {
    this.setJwt('');
    this.decodedJwt = null;
  }

  private setJwt(jwtString: string) {
    this.rawJwt = jwtString;
    this.appModel.saveState(UtilsModel.STORE_JWT_KEY, jwtString);
  }
}

const [UtilsContext, useUtilsModel] = connect(UtilsModel);

export { UtilsContext, useUtilsModel };