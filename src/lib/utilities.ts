import { type IZXCVBNResult } from 'zxcvbn-typescript'
import childProcess from 'child_process'
import packageJson from '../../package.json'
import { Constants } from '@/config/Constants'

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString('base64')
}
export const decodeBase64 = (data: string) => {
  return Buffer.from(data, 'base64').toString('ascii')
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const execChildProcess = async (comando: string) => {
  const childProcess = require('child_process')
  return await new Promise((resolve, reject) => {
    childProcess.exec(
      comando,
      (error: childProcess.ExecException, stdout: string, stderr: string) => {
        return error ? reject(stderr) : resolve(stdout)
      }
    )
  })
}

export const versionNumber = () => {
  return packageJson.version
}

export const serviceName = () => {
  return packageJson.name
}

export const siteName = () => {
  return Constants.siteName ?? ''
}

export const securityPassword = async (
  pass: string
): Promise<IZXCVBNResult> => {
  const zxcvbnLib = (await import('zxcvbn-typescript')).default
  return zxcvbnLib(pass)
}

export const capitalizeFirstLetter = (string: string) =>
  string
    .split('')
    .map((char, index) => (index === 0 ? char.toUpperCase() : char))
    .join('')
