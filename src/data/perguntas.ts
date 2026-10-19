// Fonte de verdade: perguntas.md (v2). Mantenha os dois em sincronia.
// Eixos: "E" economia (+ = direita), "S" costumes (+ = conservador).
// d = direção de quem CONCORDA com a frase.

export type Axis = 'E' | 'S';
export type Direction = 1 | -1;

export type Theme = {
  id: string;
  axis: Axis;
  name: string;
  // Rótulos das pontas da barra do tema: negativo ↔ positivo
  low: string;
  high: string;
};

export type Question = {
  id: string;
  theme: string;
  text: string;
  d: Direction;
};

export type TodayQuestion = {
  id: string;
  axis: Axis;
  text: string;
  d: Direction;
};

export const THEMES: Theme[] = [
  { id: 'E1', axis: 'E', name: 'Estado e mercado', low: 'Mais Estado', high: 'Mais mercado' },
  { id: 'E2', axis: 'E', name: 'Impostos e bem-estar social', low: 'Redistribuir', high: 'Menos impostos' },
  { id: 'E3', axis: 'E', name: 'Trabalho', low: 'Proteger', high: 'Flexibilizar' },
  { id: 'E4', axis: 'E', name: 'Meio ambiente e terra', low: 'Preservar', high: 'Produzir' },
  { id: 'S1', axis: 'S', name: 'Segurança e justiça', low: 'Garantias', high: 'Punição' },
  { id: 'S2', axis: 'S', name: 'Liberdade individual e drogas', low: 'Liberdade', high: 'Proibição' },
  { id: 'S3', axis: 'S', name: 'Família, religião e moral', low: 'Secular', high: 'Religioso' },
  { id: 'S4', axis: 'S', name: 'Diversidade e igualdade', low: 'Diversidade', high: 'Tradição' },
];

export const QUESTIONS: Question[] = [
  // E1 · Estado e mercado
  { id: 'E1.1', theme: 'E1', d: 1, text: 'Empresas como os Correios funcionariam melhor nas mãos da iniciativa privada.' },
  { id: 'E1.2', theme: 'E1', d: 1, text: 'Quanto menos o governo interferir na economia, melhor para todos.' },
  { id: 'E1.3', theme: 'E1', d: 1, text: 'O governo não deveria controlar preços, nem quando eles sobem muito.' },
  { id: 'E1.4', theme: 'E1', d: -1, text: 'Setores estratégicos, como petróleo e energia, devem ficar sob controle do Estado.' },
  { id: 'E1.5', theme: 'E1', d: -1, text: 'O governo deve investir diretamente em indústrias e obras para fazer o país crescer.' },
  { id: 'E1.6', theme: 'E1', d: -1, text: 'O governo deveria proteger a indústria nacional da concorrência de produtos importados.' },

  // E2 · Impostos e bem-estar social
  { id: 'E2.1', theme: 'E2', d: 1, text: 'O Brasil cobra impostos demais, e reduzir a carga deveria ser prioridade.' },
  { id: 'E2.2', theme: 'E2', d: 1, text: 'Programas sociais como o Bolsa Família desestimulam as pessoas a trabalhar.' },
  { id: 'E2.3', theme: 'E2', d: 1, text: 'Universidades públicas deveriam cobrar mensalidade de quem pode pagar.' },
  { id: 'E2.4', theme: 'E2', d: -1, text: 'Quem ganha mais deveria pagar uma porcentagem maior da renda em impostos.' },
  { id: 'E2.5', theme: 'E2', d: -1, text: 'Reduzir a desigualdade entre ricos e pobres é dever do governo.' },
  { id: 'E2.6', theme: 'E2', d: -1, text: 'Programas como o Bolsa Família deveriam ser ampliados.' },

  // E3 · Trabalho
  { id: 'E3.1', theme: 'E3', d: 1, text: 'O acordo direto entre empresa e trabalhador deveria valer mais do que a lei trabalhista.' },
  { id: 'E3.2', theme: 'E3', d: 1, text: 'Leis trabalhistas rígidas fazem as empresas contratarem menos.' },
  { id: 'E3.3', theme: 'E3', d: 1, text: 'O trabalhador deveria poder abrir mão de férias ou 13º em troca de um salário maior.' },
  { id: 'E3.4', theme: 'E3', d: -1, text: 'Motoristas e entregadores de aplicativo deveriam ter os direitos de quem tem carteira assinada.' },
  { id: 'E3.5', theme: 'E3', d: -1, text: 'Sindicatos fortes são importantes para defender o trabalhador.' },
  { id: 'E3.6', theme: 'E3', d: -1, text: 'O salário mínimo deveria subir acima da inflação todo ano.' },

  // E4 · Meio ambiente e terra
  { id: 'E4.1', theme: 'E4', d: 1, text: 'Crescimento econômico deve vir antes da preservação ambiental.' },
  { id: 'E4.2', theme: 'E4', d: 1, text: 'As regras ambientais no Brasil atrapalham quem quer produzir.' },
  { id: 'E4.3', theme: 'E4', d: 1, text: 'O agronegócio deveria ter mais liberdade para expandir suas áreas de produção.' },
  { id: 'E4.4', theme: 'E4', d: -1, text: 'O governo deveria demarcar mais terras indígenas.' },
  { id: 'E4.5', theme: 'E4', d: -1, text: 'O governo deveria desapropriar terras improdutivas para fazer reforma agrária.' },
  { id: 'E4.6', theme: 'E4', d: -1, text: 'Empresas que poluem deveriam pagar mais impostos por isso.' },

  // S1 · Segurança e justiça
  { id: 'S1.1', theme: 'S1', d: 1, text: 'A maioridade penal deveria ser reduzida para 16 anos.' },
  { id: 'S1.2', theme: 'S1', d: 1, text: 'O cidadão comum deveria ter o direito de andar armado para se defender.' },
  { id: 'S1.3', theme: 'S1', d: 1, text: 'Penas mais duras são a melhor forma de reduzir a criminalidade.' },
  { id: 'S1.4', theme: 'S1', d: -1, text: 'Policiais deveriam ser obrigados a usar câmeras no uniforme.' },
  { id: 'S1.5', theme: 'S1', d: -1, text: 'Quem comete crimes sem violência deveria cumprir pena alternativa em vez de ir para a cadeia.' },
  { id: 'S1.6', theme: 'S1', d: -1, text: 'Direitos humanos valem para todos, inclusive para quem cometeu crimes.' },

  // S2 · Liberdade individual e drogas
  { id: 'S2.1', theme: 'S2', d: 1, text: 'Usar drogas deveria continuar sendo crime.' },
  { id: 'S2.2', theme: 'S2', d: 1, text: 'O Estado deveria proibir atividades que fazem mal à própria pessoa, como jogos de azar.' },
  { id: 'S2.3', theme: 'S2', d: 1, text: 'A internação compulsória de dependentes químicos deveria ser mais usada.' },
  { id: 'S2.4', theme: 'S2', d: -1, text: 'A maconha deveria ser legalizada para uso adulto.' },
  { id: 'S2.5', theme: 'S2', d: -1, text: 'Dependência de drogas deve ser tratada como questão de saúde, não de polícia.' },
  { id: 'S2.6', theme: 'S2', d: -1, text: 'Cada adulto deveria poder decidir o que faz com o próprio corpo, desde que não prejudique ninguém.' },

  // S3 · Família, religião e moral
  { id: 'S3.1', theme: 'S3', d: 1, text: 'O aborto deveria ser proibido em todos os casos, inclusive em caso de estupro.' },
  { id: 'S3.2', theme: 'S3', d: 1, text: 'Valores religiosos deveriam orientar as leis do país.' },
  { id: 'S3.3', theme: 'S3', d: 1, text: 'A família formada por pai, mãe e filhos deveria ter prioridade nas políticas públicas.' },
  { id: 'S3.4', theme: 'S3', d: -1, text: 'O aborto deveria deixar de ser crime nas primeiras semanas de gestação.' },
  { id: 'S3.5', theme: 'S3', d: -1, text: 'Escolas públicas não deveriam ter ensino religioso.' },
  { id: 'S3.6', theme: 'S3', d: -1, text: 'Educação sexual deveria fazer parte do currículo das escolas.' },

  // S4 · Diversidade e igualdade
  { id: 'S4.1', theme: 'S4', d: 1, text: 'Cotas nas universidades deveriam ser só por renda, não por raça.' },
  { id: 'S4.2', theme: 'S4', d: 1, text: 'O politicamente correto foi longe demais.' },
  { id: 'S4.3', theme: 'S4', d: 1, text: 'Atletas trans deveriam competir na categoria do seu sexo de nascimento.' },
  { id: 'S4.4', theme: 'S4', d: -1, text: 'Cotas raciais nas universidades são uma política justa.' },
  { id: 'S4.5', theme: 'S4', d: -1, text: 'Casais do mesmo sexo devem ter os mesmos direitos de casar e adotar que os outros casais.' },
  { id: 'S4.6', theme: 'S4', d: -1, text: 'As escolas deveriam ensinar respeito à diversidade, incluindo pessoas LGBT.' },
];

// Bloco "Brasil de hoje" (edição 2026): não mexe no mapa, só serve de comparação.
export const TODAY_EDITION = '2026';

export const TODAY: TodayQuestion[] = [
  { id: 'B1', axis: 'E', d: -1, text: 'O fim da escala 6x1 foi uma decisão acertada.' },
  { id: 'B2', axis: 'E', d: -1, text: 'Foi certo isentar do IR quem ganha até R$ 5 mil e cobrar um imposto mínimo de quem ganha muito.' },
  { id: 'B3', axis: 'E', d: -1, text: 'Motoristas de aplicativo deveriam ter um piso de remuneração definido por lei.' },
  { id: 'B4', axis: 'E', d: 1, text: 'A Petrobras deveria explorar petróleo na Margem Equatorial, perto da foz do Amazonas.' },
  { id: 'B5', axis: 'E', d: 1, text: 'O Brasil deveria se alinhar mais aos EUA do que à China.' },
  { id: 'B6', axis: 'S', d: 1, text: 'Facções como PCC e Comando Vermelho deveriam ser classificadas como organizações terroristas.' },
  { id: 'B7', axis: 'S', d: 1, text: 'Os condenados pelos atos de 8 de janeiro deveriam ter as penas reduzidas ou ser anistiados.' },
  { id: 'B8', axis: 'S', d: 1, text: 'O STF tem interferido demais em decisões que caberiam ao Congresso.' },
  { id: 'B9', axis: 'S', d: -1, text: 'Redes sociais deveriam ser responsabilizadas por conteúdo criminoso publicado pelos usuários.' },
  { id: 'B10', axis: 'S', d: -1, text: 'A urna eletrônica é confiável.' },
];

// Ordem do quiz: alterna economia e costumes (E1, S1, E2, S2...) e, dentro de cada
// tema, alterna o lado da frase. Assim os pares espelhados ficam longe um do outro
// e a pessoa não percebe um padrão.
const WITHIN_THEME = [0, 3, 1, 4, 2, 5];
const THEME_ORDER = ['E1', 'S1', 'E2', 'S2', 'E3', 'S3', 'E4', 'S4'];

export const QUIZ_ORDER: Question[] = WITHIN_THEME.flatMap((slot) =>
  THEME_ORDER.map((themeId) => QUESTIONS.filter((q) => q.theme === themeId)[slot]),
);

// Modo rápido: 1 frase de cada lado por tema (16 no total), as que mais separam os lados.
// A ordem segue a mesma lógica: alterna eixo e lado da frase.
const QUICK_IDS = [
  'E1.1', 'S1.6', 'E2.5', 'S2.1', 'E3.2', 'S3.4', 'E4.5', 'S4.2',
  'E1.4', 'S1.2', 'E2.1', 'S2.4', 'E3.5', 'S3.2', 'E4.1', 'S4.4',
];

export const QUICK_ORDER: Question[] = QUICK_IDS.map((id) => QUESTIONS.find((q) => q.id === id)!);

export type Mode = 'completo' | 'rapido';

export const ORDER_BY_MODE: Record<Mode, Question[]> = {
  completo: QUIZ_ORDER,
  rapido: QUICK_ORDER,
};

export const themeById = (id: string) => THEMES.find((t) => t.id === id)!;

// Pares espelhados: frases que dizem o oposto uma da outra. Concordar (ou discordar)
// das duas indica resposta no automático. Só existem juntos no teste completo.
export const MIRROR_PAIRS: { label: string; ids: [string, string] }[] = [
  { label: 'Bolsa Família', ids: ['E2.2', 'E2.6'] },
  { label: 'drogas', ids: ['S2.1', 'S2.4'] },
  { label: 'aborto', ids: ['S3.1', 'S3.4'] },
  { label: 'cotas', ids: ['S4.1', 'S4.4'] },
];
