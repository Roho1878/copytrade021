import { query } from '@/lib/db';

export type Follower = {
  id: string;
  name: string;
  accountId: string;
  followers: number;
  performance: string;
  equity: string;
  balance: string;
  openTrades: number;
  lastSignal: string;
  risk: string;
};

export async function getFollowers(): Promise<Follower[]> {
  return await query<Follower>(`
    SELECT id, name, account_id AS accountId, followers_count AS followers, performance, equity, balance, open_trades AS openTrades, last_signal AS lastSignal, risk_level AS risk
    FROM followers
    ORDER BY followers_count DESC
    LIMIT 200
  `);
}

export async function getFollowerById(id: string): Promise<Follower | null> {
  const results = await query<Follower>(`
    SELECT id, name, account_id AS accountId, followers_count AS followers, performance, equity, balance, open_trades AS openTrades, last_signal AS lastSignal, risk_level AS risk
    FROM followers
    WHERE id = ?
    LIMIT 1
  `, [id]);

  return results.length ? results[0] : null;
}
