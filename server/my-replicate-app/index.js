import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'black-forest-labs/flux-pro:caf8d6bf110808c53bb90767ea81e1bbd0f0690ba37a4a24b27b17e2f9a5c011'
const input = {
  steps: 25,
  width: 1024,
  height: 1024,
  prompt: "The world's largest black forest cake, the size of a building, surrounded by trees of the black forest",
  guidance: 3,
  interval: 2,
  safety_tolerance: 2,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
