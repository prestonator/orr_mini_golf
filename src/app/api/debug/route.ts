import { NextResponse } from 'next/server';
import { getMapState } from '@/app/game/actions';

export async function GET() {
  const data = await getMapState();
  return NextResponse.json(data);
}
