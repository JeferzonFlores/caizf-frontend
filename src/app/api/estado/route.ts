import { NextResponse } from 'next/server'
import { Constants } from '@/config/Constants'
import { serviceName, versionNumber } from '@/lib/utilities'
import { commitDate, commitID, branchName } from '@/lib/vcsInfo'

export async function GET() {
  return NextResponse.json({
    servicio: serviceName(),
    version: versionNumber(),
    entorno: Constants.appEnv,
    estado: `Servicio funcionando correctamente 🙌`,
    hora: new Date().getTime(),
    b: await branchName(),
    cid: await commitID(),
    cd: await commitDate(),
  })
}
