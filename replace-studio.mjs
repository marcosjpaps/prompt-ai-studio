import fs from 'fs';
const file = 'app/studio.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Add state variables
let stateLineIndex = lines.findIndex(l => l.includes('const [view,setView]=useState<View>'));
if (stateLineIndex !== -1) {
    let stateLine = lines[stateLineIndex];
    stateLine = stateLine.replace('const [view,setView]=useState<View>(\'Dashboard\'),', 'const [view,setView]=useState<View>(\'Dashboard\'),[apiKey,setApiKey]=useState(()=>typeof localStorage!==\'undefined\'?localStorage.getItem(\'ai_key\')||\'\':\'\'),[aiProvider,setAiProvider]=useState(()=>typeof localStorage!==\'undefined\'?localStorage.getItem(\'ai_provider\')||\'openrouter\':\'openrouter\'),');
    lines[stateLineIndex] = stateLine;
}

// 2. Add apiKey and aiProvider to analyze()
let analyzeLineIndex = lines.findIndex(l => l.includes('async function analyze(){'));
if (analyzeLineIndex !== -1) {
    let analyzeLine = lines[analyzeLineIndex];
    analyzeLine = analyzeLine.replace("api('analyze-image',{imageId:image.id})", "api('analyze-image',{imageId:image.id,apiKey,aiProvider})");
    lines[analyzeLineIndex] = analyzeLine;
}

// 3. Update the Configurações UI
let settingsLineIndex = lines.findIndex(l => l.includes("{view==='Configurações'&&"));
if (settingsLineIndex !== -1) {
    lines[settingsLineIndex] = " {view==='Configurações'&&<><div className=\"page-heading\"><div><div className=\"eyebrow\">DO SEU JEITO</div><h1>Seu estúdio, organizado.</h1><p>Conta, conexões e estado da plataforma.</p></div></div><div className=\"settings-list\"><section className=\"panel\"><h2>Sua conta</h2><p>{user?.email||'Autenticado.'}</p><a className=\"secondary-button inline-flex\" href=\"/api/logout\" target=\"_top\">Sair da conta</a></section><section className=\"panel\"><div className=\"vision-heading\"><h2>Provedor de Inteligência Artificial</h2><span className=\"status-tag\">{ai||apiKey?'Configurado':'Pendente'}</span></div><p>Configure sua chave de API para habilitar a Análise Visual Automática de referências de imagem.</p><label className=\"field\"><span>Selecione o provedor</span><Select value={aiProvider} onValueChange={v=>{setAiProvider(v);localStorage.setItem('ai_provider',v)}}><SelectTrigger className=\"picker\"><SelectValue/></SelectTrigger><SelectContent><SelectItem value=\"openrouter\">OpenRouter (Acesso a +100 IAs)</SelectItem><SelectItem value=\"openai\">OpenAI (ChatGPT)</SelectItem><SelectItem value=\"groq\">Groq (Rápido/Llama 3)</SelectItem></SelectContent></Select></label><label className=\"field\"><span>Chave de API (salva apenas no seu navegador local)</span><input type=\"password\" placeholder=\"sk-...\" value={apiKey} onChange={e=>{setApiKey(e.target.value);localStorage.setItem('ai_key',e.target.value)}}/></label><p className=\"fine-print\">A chave fica salva com segurança apenas no seu dispositivo. Sem ela configurada aqui, você ainda pode gerar todos os seus prompts livremente, digitando a descrição manualmente.</p></section></div></>}";
}

fs.writeFileSync(file, lines.join('\n'));
