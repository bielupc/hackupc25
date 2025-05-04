declare module "predicthq" {
  export default class Client {
    constructor(config: { access_token: string; fetch: any });
    events: {
      search: (params: any) => Promise<{
        result: {
          results: any[];
        };
      }>;
    };
  }
}
