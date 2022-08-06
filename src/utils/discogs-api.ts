import axios from 'axios';

export class DiscogsApi {
  async getVinylsByBarcode(barcode: string): Promise<any> {
    const url = `https://api.discogs.com/database/search?format=vinyl&barcode=${barcode}`;
    return this.callDiscogsApi(url);
  }

  async getMasterById(masterId: number): Promise<any> {
    const url = `https://api.discogs.com/masters/${masterId}`;
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
    } catch (error) {
      throw new Error(error);
    }
  }
}
