

export const NS_PER_SEC = 1e9
export const MS_PER_NS = 1e6

type HRTime = [number, number];

export interface HttpEventTimes {
  dnsLookup: number;
  tcpConnection: number;
  tlsHandshake: number;
  firstByte: number;
  contentTransfer: number;
  total: number;
  totalFormatted: string;
}

export class HttpTimings {

  public static start() {
    const timings = new HttpTimings();
    timings.start();
    return timings;
  }

  private startAt: HRTime;
  private dnsLookupAt: HRTime;
  private tcpConnectionAt: HRTime;
  private tlsHandshakeAt: HRTime;
  private firstByteAt: HRTime;
  private endAt: HRTime;

  public start() {
    this.startAt = process.hrtime();
  }

  public setFirstByte() {
    this.firstByteAt = process.hrtime();
  }

  public end() {
    this.endAt = process.hrtime();
  }

  public setDnsLookup() {
    this.dnsLookupAt = process.hrtime()
  }

  public setTcpConnection() {
    this.tcpConnectionAt = process.hrtime()
  }

  public setTlsHandshake() {
    this.tlsHandshakeAt = process.hrtime()
  }

  public getTimings(): HttpEventTimes {
    return {
      dnsLookup: this.duration(this.startAt, this.dnsLookupAt),
      tlsHandshake: this.duration(this.tcpConnectionAt, this.tlsHandshakeAt),
      tcpConnection: this.duration(this.dnsLookupAt || this.startAt, this.tcpConnectionAt),
      firstByte: this.duration((this.tlsHandshakeAt || this.tcpConnectionAt), this.firstByteAt),
      contentTransfer: this.duration(this.firstByteAt, this.endAt),
      total: this.duration(this.startAt, this.endAt),
      totalFormatted: this.duration(this.startAt, this.endAt).toFixed(2),
    };
  }

  private duration(startTime, endTime): number {
    if (startTime === undefined || endTime === undefined) {
      return undefined;
    }

    const secondDiff = endTime[0] - startTime[0];
    const nanoSecondDiff = endTime[1] - startTime[1];
    const diffInNanoSecond = secondDiff * NS_PER_SEC + nanoSecondDiff;

    return diffInNanoSecond / MS_PER_NS;
  }
}
