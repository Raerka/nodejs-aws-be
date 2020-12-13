import { CACHE_MANAGER, HttpException, HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  services;
  cacheableUrls;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {
    this.services = {
      cart: process.env.CART_SERVICE_URL,
      product: process.env.PRODUCT_SERVICE_URL,
    };

    this.cacheableUrls = ['/product/products'];
  }

  async process(service, request) {
    const { originalUrl, method, body} = request;

    console.log('serviceName', service);
    console.log('originalUrl', originalUrl);
    console.log('method', method);
    console.log('body', body);

    const serviceUrl = this.services[service];
    console.log(serviceUrl);

    const isCacheEnabled = this.cacheableUrls.includes(originalUrl);
    if (isCacheEnabled) {
      const cachedData = await this.cacheManager.get(originalUrl);
      if (cachedData) {
        return cachedData;
      }
    }

    if (serviceUrl) {
      try {
        const config = {
          url: `${serviceUrl}/${originalUrl.split('/').slice(2).join('/')}`,
          method: method,
          ...(Object.keys(body || { }).length > 0 && { data: body}),
        };

        console.log('config', config);

        const { data } = await this.httpService.request(config).toPromise();

        console.log('response data', data);

        if (isCacheEnabled) {
          await this.cacheManager.set(originalUrl, data, 120);
        }

        return data;
      } catch (err) {
        console.log(err.message);

        if (err.response) {
          const { status, data } = err.response;
          throw new HttpException(data, status);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }

    } else {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }
  }
}
