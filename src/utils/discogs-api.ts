import axios from 'axios';

export class DiscogsApi {
  API_ENDPOINT = 'https://api.discogs.com';

  async getVinylsByBarcode(barcode: string): Promise<any> {
    const url = `${this.API_ENDPOINT}/database/search?format=vinyl&barcode=${barcode}`;
    return this.callDiscogsApi(url);
  }

  async getMasterById(masterId: number): Promise<any> {
    const url = `${this.API_ENDPOINT}/masters/${masterId}`;
    return this.callDiscogsApi(url);
  }

  private async callDiscogsApi(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process.env.DISCOGS_SECRET}`,
        },
      });
      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
