import axios from 'axios';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class SpotifyApi {
  SPOTIFY_CACHE_TOKEN_KEY = 'SPOTIFY_AUTH_TOKEN';

  AUTH_ENDPOINT = 'https://accounts.spotify.com/api/token';

  API_ENDPOINT = 'https://api.spotify.com/v1';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOneAlbum(name: string, artist: string): Promise<any | null> {
    try {
      name = encodeURIComponent(name);
      artist = encodeURIComponent(artist);

      const query = `album:${name} artist:${artist}`;
      const url = `${this.API_ENDPOINT}/search?q=${query}&type=album&limit=1`;
      const res = await this.callSpotityApi(url);

      if (res.albums.items.length !== 1) {
        return null;
      }

      return res.albums.items[0];
    } catch (e) {
      return null;
    }
  }

  async getAlbumCoverURL(name: string, artist: string): Promise<string | null> {
    const album = await this.getOneAlbum(name, artist);

    if (!album || album.images.length === 0) {
      return null;
    }

    return album.images[0]?.url;
  }

  private async authenticate(): Promise<string> {
    const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const authorization = Buffer.from(authString).toString('base64');

    try {
      const response = await axios.post(
        this.AUTH_ENDPOINT,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${authorization}`,
          },
        },
      );

      await this.cacheManager.set(
        this.SPOTIFY_CACHE_TOKEN_KEY,
        response.data.access_token,
        response.data.expires_in,
      );

      return response.data.access_token;
    } catch (e) {
      throw new Error('Spotify authentication failed');
    }
  }

  private async callSpotityApi(url: string): Promise<any> {
    let token = await this.cacheManager.get(this.SPOTIFY_CACHE_TOKEN_KEY);
    if (!token) {
      token = await this.authenticate();
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (e) {
      if (e.response.status === 401) {
        await this.cacheManager.del(this.SPOTIFY_CACHE_TOKEN_KEY);
        return this.callSpotityApi(url);
      }
      throw new Error(e);
    }
  }
}
