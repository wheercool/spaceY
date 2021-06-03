export interface WS {
  on(msg: string, callback: (msg: string) => void);

  send(msg: string);
}
