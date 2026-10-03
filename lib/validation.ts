import { z } from 'zod';
import { initialConfig, objectives } from './prompt';
export const configSchema=z.object({
 name:z.string().max(120),objective:z.string().refine(v=>objectives.includes(v)),
 description:z.string().max(8000),action:z.string().max(8000),
 camera:z.enum(['50 mm · altura dos olhos','35 mm · travelling suave','85 mm · close nos detalhes','iPhone · enquadramento próximo']),
 lighting:z.enum(['Luz natural suave','Luz lateral cinematográfica','Estúdio difuso','Golden hour']),
 style:z.enum(['Ultrarrealista','Cinematográfico','UGC natural','Fotografia editorial']),ratio:z.enum(['9:16','16:9','1:1','4:5']),language:z.enum(['English','Português']),preserve:z.boolean(),memory:z.string().max(8000)
});
export const saveSchema=z.object({name:z.string().trim().min(1).max(120),objective:z.string().optional(),imageId:z.string().uuid().nullable().optional(),config:configSchema.default(()=>configSchema.parse(initialConfig)),prompt:z.string().trim().min(1).max(40000),negative:z.string().max(8000).default(''),script:z.string().max(8000).default('')});
export const memorySchema=z.object({kind:z.enum(['character','product']),name:z.string().trim().min(1).max(100),details:z.string().trim().min(1).max(6000)});
export class InputError extends Error {constructor(message:string,public status=400){super(message)}}
export async function readLimited(req:Request,maxBytes:number){
 if(Number(req.headers.get('content-length')||0)>maxBytes)throw new InputError('Conteúdo muito grande para esta operação.',413);
 const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new InputError('Conteúdo muito grande para esta operação.',413)}chunks.push(value)}
 const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.byteLength}return result;
}
export async function jsonBody(req:Request){
 if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new InputError('Envie os dados em formato JSON.',415);
 const bytes=await readLimited(req,256*1024);
 try{const data=JSON.parse(new TextDecoder().decode(bytes));if(!data||Array.isArray(data)||typeof data!=='object')throw new Error();return data as Record<string,unknown>}catch{throw new InputError('Dados inválidos. Revise os campos e tente novamente.')}
}
export function validImage(bytes:Uint8Array,mime:string){
 if(mime==='image/png'){
  if(bytes.length<45||![137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return false;
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);if(view.getUint32(8)!==13||String.fromCharCode(...bytes.subarray(12,16))!=='IHDR')return false;
  const width=view.getUint32(16),height=view.getUint32(20);if(!width||!height||width>20000||height>20000)return false;
  let offset=8;while(offset+12<=bytes.length){const length=view.getUint32(offset);if(offset+length+12>bytes.length)return false;const type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));if(type==='IEND')return length===0;offset+=length+12;}return false;
 }
 if(mime==='image/jpeg')return bytes.length>=12&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255&&bytes[bytes.length-2]===255&&bytes[bytes.length-1]===217;
 if(mime==='image/webp')return bytes.length>=20&&String.fromCharCode(...bytes.subarray(0,4))==='RIFF'&&new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(4,true)+8===bytes.length&&String.fromCharCode(...bytes.subarray(8,12))==='WEBP'&&['VP8 ','VP8L','VP8X'].includes(String.fromCharCode(...bytes.subarray(12,16)));
 return false;
}
