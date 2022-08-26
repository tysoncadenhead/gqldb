import {IAdapterOptions} from 'graphqldb-types';

export interface AdapterInterface {
  create<A, B>(adapterOption: IAdapterOptions, input: A): Promise<B>;
  update<A, B>(adapterOption: IAdapterOptions, input: A): Promise<B>;
  delete<A, B>(adapterOption: IAdapterOptions, input: A): Promise<B>;
  find<A, B>(adapterOption: IAdapterOptions, input: A): Promise<B>;
  query<A, B>(adapterOption: IAdapterOptions, input: A): Promise<B>;
  queryByIndex<A, B>(
    adapterOption: IAdapterOptions,
    index: string,
    input: A,
  ): Promise<B>;
}
