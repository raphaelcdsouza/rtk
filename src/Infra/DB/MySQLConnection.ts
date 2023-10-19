import { Pool, RowDataPacket, createPool } from 'mysql2/promise';

import { ISQLDatabase } from '../Interfaces/DB';
import { logger } from '../../Utils';
import { DatabaseError } from '../../Errors';
import { mysqlErrorMapper } from '../../Utils/DB/Error';
import { SQLConnectionConfigType } from '../Types/DB';

export class MySQLConnection implements ISQLDatabase {
  private pool: Pool;

  constructor(config: SQLConnectionConfigType) {
    this.pool = createPool(config);
  }

  public async query <K>(query: string, values?: any[]): Promise<K[]> {
    const client = await this.pool.getConnection();

    try {
      const [rows] = await client.query<[K & RowDataPacket[]]>(query, values);
      return rows;
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') logger(err);
      throw new DatabaseError(err.message, mysqlErrorMapper(err.errno), 'mysql', err.errno);
    } finally {
      client.release();
    }
  }
}
