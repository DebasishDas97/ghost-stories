import path from 'node:path'
import fs from 'node:fs/promises'
import { getData } from './getData.js'
import { v4 as uuidv4 } from 'uuid';

export async function addNewSighting(newSighting) {

  try {

    const sightings = await getData()
    sightings.push({uuid: uuidv4(), ...newSighting})
    const pathJSON = path.join('data', 'data.json')

    await fs.writeFile(
      pathJSON,
      JSON.stringify(sightings, null, 2),
      'utf8'
    )
  } catch (err) {
    throw new Error(err)
  }

}
