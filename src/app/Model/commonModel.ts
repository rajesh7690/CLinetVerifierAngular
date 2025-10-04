export interface JwtPayload {
  id?: string;
  firstName?: string;
  lastName?: string;
  exp?: number;
  jti?: string;
  [key: string]: any;
}
