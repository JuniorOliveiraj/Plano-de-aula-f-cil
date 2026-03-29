import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  await prisma.bnccHabilidade.createMany({
    data: [
      // ─── 1º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF01MA01", serie: 1, area: "MA", unidade: "Números", descricao: "Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação." },
      { codigo: "EF01MA02", serie: 1, area: "MA", unidade: "Números", descricao: "Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos." },
      { codigo: "EF01MA03", serie: 1, area: "MA", unidade: "Números", descricao: "Estimar e comparar quantidades de objetos de dois conjuntos (em torno de 20 elementos), por estimativa e/ou por correspondência (um a um, dois a um, entre outros), para indicar 'tem mais', 'tem menos' ou 'tem a mesma quantidade'." },
      { codigo: "EF01MA04", serie: 1, area: "MA", unidade: "Números", descricao: "Contar a quantidade de objetos de coleções até 100 unidades e indicar a quantidade por meio de escrita numérica." },
      { codigo: "EF01MA05", serie: 1, area: "MA", unidade: "Números", descricao: "Comparar números naturais de até duas ordens em situações cotidianas, com e sem suporte da reta numérica." },
      { codigo: "EF01MA06", serie: 1, area: "MA", unidade: "Álgebra", descricao: "Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas." },
      { codigo: "EF01MA11", serie: 1, area: "MA", unidade: "Geometria", descricao: "Descrever a localização de pessoas e de objetos no espaço em relação à sua própria posição, utilizando termos como à direita, à esquerda, em frente, atrás." },

      // ─── 1º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF01LP01", serie: 1, area: "LP", unidade: "Leitura", descricao: "Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página." },
      { codigo: "EF01LP02", serie: 1, area: "LP", unidade: "Leitura", descricao: "Buscar, com a mediação do professor, informações em textos lidos em voz alta, como listas, avisos, receitas, entre outros." },
      { codigo: "EF01LP03", serie: 1, area: "LP", unidade: "Escrita", descricao: "Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas." },
      { codigo: "EF01LP04", serie: 1, area: "LP", unidade: "Oralidade", descricao: "Escutar com atenção textos lidos e contados pelo professor, formulando perguntas e comentários sobre o assunto." },
      { codigo: "EF01LP05", serie: 1, area: "LP", unidade: "Análise Linguística", descricao: "Reconhecer que as letras do alfabeto são ordenadas e que existem letras maiúsculas e minúsculas." },
      { codigo: "EF01LP06", serie: 1, area: "LP", unidade: "Leitura", descricao: "Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização." },
      { codigo: "EF01LP16", serie: 1, area: "LP", unidade: "Leitura", descricao: "Ler e compreender, em colaboração com os colegas e com a ajuda do professor, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana." },

      // ─── 1º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF01HI01", serie: 1, area: "HI", unidade: "Mundo pessoal", descricao: "Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou de lembranças dos membros de sua família e/ou de sua comunidade." },
      { codigo: "EF01HI02", serie: 1, area: "HI", unidade: "Mundo pessoal", descricao: "Identificar a relação entre as suas histórias e as histórias de sua família e de sua comunidade." },
      { codigo: "EF01HI03", serie: 1, area: "HI", unidade: "Mundo pessoal", descricao: "Descrever e distinguir os seus papéis e responsabilidades relacionados à família, à escola e à comunidade." },
      { codigo: "EF01HI04", serie: 1, area: "HI", unidade: "Mundo pessoal", descricao: "Identificar as diferenças entre os variados ambientes em que vive (doméstico, escolar e da comunidade), reconhecendo especificidades dos hábitos e das regras que os regem." },

      // ─── 1º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF01GE01", serie: 1, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Descrever características observadas de seus lugares de vivência (moradia, escola, etc.) e identificar semelhanças e diferenças entre esses lugares." },
      { codigo: "EF01GE02", serie: 1, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Identificar semelhanças e diferenças entre jogos e brincadeiras de diferentes épocas e lugares." },
      { codigo: "EF01GE03", serie: 1, area: "GE", unidade: "Conexões e escalas", descricao: "Identificar e elaborar diferentes tipos de representações do espaço vivido (mapas mentais, maquetes, desenhos, entre outros)." },
      { codigo: "EF01GE04", serie: 1, area: "GE", unidade: "Mundo do trabalho", descricao: "Reconhecer as atividades de trabalho vinculadas ao dia a dia da família e da escola." },

      // ─── 1º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF01CI01", serie: 1, area: "CI", unidade: "Matéria e energia", descricao: "Comparar características de diferentes materiais presentes em objetos de uso cotidiano, discutindo sua origem, os modos como são descartados e como podem ser usados de forma mais consciente." },
      { codigo: "EF01CI02", serie: 1, area: "CI", unidade: "Vida e evolução", descricao: "Localizar, nomear e representar graficamente (por meio de desenhos) partes do corpo humano e explicar suas funções." },
      { codigo: "EF01CI03", serie: 1, area: "CI", unidade: "Vida e evolução", descricao: "Discutir as razões pelas quais os hábitos de higiene do corpo (lavar as mãos antes de comer, escovar os dentes, limpar os olhos, o nariz e as orelhas etc.) são necessários para a manutenção da saúde." },
      { codigo: "EF01CI04", serie: 1, area: "CI", unidade: "Terra e Universo", descricao: "Identificar características sobre o modo de vida (o que comem, como se reproduzem, como se locomovem etc.) dos animais mais comuns no ambiente próximo." },

      // ─── 2º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF02MA01", serie: 2, area: "MA", unidade: "Números", descricao: "Comparar e ordenar números naturais (até a ordem de centenas) pela compreensão de características do sistema de numeração decimal (valor posicional e função do zero)." },
      { codigo: "EF02MA02", serie: 2, area: "MA", unidade: "Números", descricao: "Fazer estimativas por meio de estratégias diversas a respeito da quantidade de objetos de coleções e registrar o resultado da contagem desses objetos (até 1000 unidades)." },
      { codigo: "EF02MA03", serie: 2, area: "MA", unidade: "Números", descricao: "Comparar quantidades de objetos de dois conjuntos, por estimativa e/ou por correspondência (um a um, dois a um, entre outros), para indicar 'tem mais', 'tem menos' ou 'tem a mesma quantidade', indicando, quando for o caso, quantos a mais e quantos a menos." },
      { codigo: "EF02MA04", serie: 2, area: "MA", unidade: "Números", descricao: "Compor e decompor números naturais de até três ordens, com suporte de material manipulável, contribuindo para a compreensão de características do sistema de numeração decimal e o desenvolvimento de estratégias de cálculo." },
      { codigo: "EF02MA05", serie: 2, area: "MA", unidade: "Números", descricao: "Construir fatos básicos da adição e da subtração e utilizá-los no cálculo mental e escrito." },
      { codigo: "EF02MA06", serie: 2, area: "MA", unidade: "Grandezas e medidas", descricao: "Indicar a duração de intervalos de tempo entre duas datas, como dias da semana e meses do ano, utilizando calendário, para planejamentos e organização de agenda." },
      { codigo: "EF02MA14", serie: 2, area: "MA", unidade: "Geometria", descricao: "Reconhecer, nomear e comparar figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera), relacionando-as com objetos do mundo físico." },

      // ─── 2º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF02LP01", serie: 2, area: "LP", unidade: "Leitura", descricao: "Ler e compreender, em colaboração com os colegas e com a ajuda do professor, enunciados de tarefas escolares, avisos, recados, convites e cartas." },
      { codigo: "EF02LP02", serie: 2, area: "LP", unidade: "Escrita", descricao: "Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, listas de regras e de procedimentos, cartazes de sala e de escola, com a função de informar e/ou de instruir." },
      { codigo: "EF02LP03", serie: 2, area: "LP", unidade: "Análise Linguística", descricao: "Segmentar corretamente as palavras ao escrever frases e textos, identificando os espaços em branco como separadores de palavras." },
      { codigo: "EF02LP04", serie: 2, area: "LP", unidade: "Oralidade", descricao: "Escutar, com atenção, textos do gênero notícia, dentre outros, formulando perguntas pertinentes ao tema e respondendo a perguntas feitas pelo professor e pelos colegas." },
      { codigo: "EF02LP05", serie: 2, area: "LP", unidade: "Leitura", descricao: "Ler e compreender, com certa autonomia, textos literários de diferentes gêneros e extensões, inclusive aqueles sem ilustrações, estabelecendo preferências por gêneros, temas, autores." },
      { codigo: "EF02LP15", serie: 2, area: "LP", unidade: "Leitura", descricao: "Cantar cantigas e canções, obedecendo ao ritmo e à melodia." },

      // ─── 2º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF02HI01", serie: 2, area: "HI", unidade: "A comunidade e seus registros", descricao: "Reconhecer o significado de datas comemorativas e de feriados civis e religiosos, identificando os processos históricos que os originaram." },
      { codigo: "EF02HI02", serie: 2, area: "HI", unidade: "A comunidade e seus registros", descricao: "Identificar e descrever práticas e papéis sociais que as pessoas exercem em diferentes comunidades." },
      { codigo: "EF02HI03", serie: 2, area: "HI", unidade: "A comunidade e seus registros", descricao: "Selecionar situações cotidianas que remetam à percepção de mudança, pertencimento e memória." },
      { codigo: "EF02HI04", serie: 2, area: "HI", unidade: "A comunidade e seus registros", descricao: "Identificar objetos e documentos pessoais que remetam à própria história e à história de sua família e de sua comunidade." },

      // ─── 2º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF02GE01", serie: 2, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Descrever a localização de seu lugar de vivência, utilizando noções de posição (frente, atrás, esquerda, direita, em cima, embaixo) e de distância (perto, longe)." },
      { codigo: "EF02GE02", serie: 2, area: "GE", unidade: "Natureza, ambientes e qualidade de vida", descricao: "Identificar e elaborar diferentes tipos de representações cartográficas do espaço vivido, reconhecendo a função dos pontos de referência." },
      { codigo: "EF02GE03", serie: 2, area: "GE", unidade: "Mundo do trabalho", descricao: "Comparar diferentes meios de transporte e de comunicação, indicando o seu papel na conexão entre lugares, e discutir os riscos para a saúde e para o meio ambiente." },
      { codigo: "EF02GE04", serie: 2, area: "GE", unidade: "Formas de representação e pensamento espacial", descricao: "Reconhecer semelhanças e diferenças nos hábitos, nas relações com a natureza e no modo de viver de pessoas em diferentes lugares." },

      // ─── 2º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF02CI01", serie: 2, area: "CI", unidade: "Matéria e energia", descricao: "Identificar de que materiais (metais, madeira, vidro etc.) são feitos os objetos que fazem parte da vida cotidiana, como esses objetos são utilizados e com quais materiais eram produzidos no passado." },
      { codigo: "EF02CI02", serie: 2, area: "CI", unidade: "Vida e evolução", descricao: "Propor o uso de diferentes materiais para a construção de objetos de uso cotidiano, tendo em vista algumas propriedades desses materiais (flexibilidade, dureza, transparência etc.)." },
      { codigo: "EF02CI03", serie: 2, area: "CI", unidade: "Vida e evolução", descricao: "Descrever características de plantas e animais (tamanho, forma, cor, fase da vida, local onde se desenvolvem etc.) que fazem parte de seu cotidiano e relacioná-las ao ambiente em que vivem." },
      { codigo: "EF02CI04", serie: 2, area: "CI", unidade: "Terra e Universo", descricao: "Descrever as posições do Sol em diferentes horários do dia e associá-las ao tamanho da sombra projetada." },

      // ─── 3º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF03MA01", serie: 3, area: "MA", unidade: "Números", descricao: "Ler, escrever e comparar números naturais de até a ordem de unidade de milhar, estabelecendo relações entre os registros numéricos e em língua materna." },
      { codigo: "EF03MA02", serie: 3, area: "MA", unidade: "Números", descricao: "Identificar características do sistema de numeração decimal, utilizando a composição e a decomposição de números naturais de até quatro ordens." },
      { codigo: "EF03MA03", serie: 3, area: "MA", unidade: "Números", descricao: "Construir e utilizar fatos básicos da adição e da multiplicação para o cálculo mental ou escrito." },
      { codigo: "EF03MA04", serie: 3, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas de adição e de subtração com os significados de juntar, acrescentar, separar, retirar, comparar e completar quantidades, utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos." },
      { codigo: "EF03MA05", serie: 3, area: "MA", unidade: "Grandezas e medidas", descricao: "Estimar, medir e comparar comprimentos de objetos, usando unidades de medida não padronizadas e padronizadas (metro, centímetro e milímetro) e instrumentos de medida adequados." },
      { codigo: "EF03MA06", serie: 3, area: "MA", unidade: "Geometria", descricao: "Identificar e registrar, em linguagem verbal ou não verbal, a localização e os deslocamentos de pessoas e de objetos no espaço, considerando mais de um ponto de referência, e indicar as mudanças de direção e de sentido." },
      { codigo: "EF03MA07", serie: 3, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas de multiplicação (por 2, 3, 4, 5 e 10) com os significados de adição de parcelas iguais e elementos apresentados em disposição retangular." },

      // ─── 3º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF03LP01", serie: 3, area: "LP", unidade: "Leitura", descricao: "Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado." },
      { codigo: "EF03LP02", serie: 3, area: "LP", unidade: "Escrita", descricao: "Planejar e produzir, com certa autonomia, cartas pessoais de reclamação, com base em situação problema apresentada, utilizando as convenções do gênero carta." },
      { codigo: "EF03LP03", serie: 3, area: "LP", unidade: "Análise Linguística", descricao: "Identificar a função e as flexões de substantivos e adjetivos e utilizar esses conhecimentos na produção de textos." },
      { codigo: "EF03LP04", serie: 3, area: "LP", unidade: "Oralidade", descricao: "Identificar e reproduzir, em relatos orais de experiências, a sequência de eventos, as descrições de personagens e de ambientes." },
      { codigo: "EF03LP05", serie: 3, area: "LP", unidade: "Leitura", descricao: "Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: o substantivo como o centro do grupo nominal e o verbo como o núcleo do grupo verbal." },

      // ─── 3º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF03HI01", serie: 3, area: "HI", unidade: "As pessoas e os grupos", descricao: "Identificar os grupos populacionais que formam a cidade, o município e a região, as relações estabelecidas entre eles e os eventos que marcam a formação da cidade..." },
      { codigo: "EF03HI02", serie: 3, area: "HI", unidade: "As pessoas e os grupos", descricao: "Selecionar, por meio da consulta de fontes de diferentes naturezas, e registrar acontecimentos ocorridos ao longo do tempo na cidade ou região em que vive." },
      { codigo: "EF03HI03", serie: 3, area: "HI", unidade: "As pessoas e os grupos", descricao: "Identificar e comparar pontos de vista sobre acontecimentos e situações de diferentes grupos sociais no tempo e no espaço." },
      { codigo: "EF03HI04", serie: 3, area: "HI", unidade: "As pessoas e os grupos", descricao: "Identificar os patrimônios históricos e culturais de sua cidade e discutir as razões culturais, sociais e políticas para que sejam preservados." },

      // ─── 3º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF03GE01", serie: 3, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Identificar e comparar aspectos culturais dos grupos sociais de seus lugares de vivência, seja na cidade, seja no campo." },
      { codigo: "EF03GE02", serie: 3, area: "GE", unidade: "Conexões e escalas", descricao: "Identificar, em seus lugares de vivência, marcas de contribuição cultural e econômica de grupos de diferentes origens culturais." },
      { codigo: "EF03GE03", serie: 3, area: "GE", unidade: "Mundo do trabalho", descricao: "Reconhecer os diferentes modos de vida de povos e comunidades tradicionais em distintos lugares." },
      { codigo: "EF03GE04", serie: 3, area: "GE", unidade: "Formas de representação", descricao: "Identificar as características das paisagens naturais e antrópicas (relevo, cobertura vegetal, rios etc.) no ambiente em que vive, bem como a ação humana." },

      // ─── 3º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF03CI01", serie: 3, area: "CI", unidade: "Matéria e energia", descricao: "Produzir diferentes sons a partir da vibração de variados objetos e identificar variáveis que influem nesse fenômeno." },
      { codigo: "EF03CI02", serie: 3, area: "CI", unidade: "Matéria e energia", descricao: "Experimentar e relatar o que ocorre com a passagem da luz através de objetos transparentes, no contato com superfícies polidas e na intersecção com objetos opacos." },
      { codigo: "EF03CI03", serie: 3, area: "CI", unidade: "Vida e evolução", descricao: "Identificar características sobre o modo de vida (o que comem, como se reproduzem, como se locomovem etc.) dos animais mais comuns no ambiente próximo." },
      { codigo: "EF03CI04", serie: 3, area: "CI", unidade: "Terra e Universo", descricao: "Identificar características da Terra (como seu formato esférico, a presença de água, solo etc.), com base na observação, manipulação e comparação de diferentes formas de representação." },

      // ─── 4º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF04MA01", serie: 4, area: "MA", unidade: "Números", descricao: "Ler, escrever e ordenar números naturais até a ordem de dezenas de milhar com compreensão das principais características do sistema de numeração decimal." },
      { codigo: "EF04MA02", serie: 4, area: "MA", unidade: "Números", descricao: "Mostrar, por decomposição e composição, que todo número natural pode ser escrito por meio de adições e multiplicações por potências de dez." },
      { codigo: "EF04MA03", serie: 4, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas com números naturais envolvendo adição e subtração, utilizando estratégias diversas." },
      { codigo: "EF04MA04", serie: 4, area: "MA", unidade: "Números", descricao: "Utilizar as relações entre adição e subtração, bem como entre multiplicação e divisão, para ampliar as estratégias de cálculo." },
      { codigo: "EF04MA05", serie: 4, area: "MA", unidade: "Números", descricao: "Reconhecer e ler números racionais cujas representações decimais são finitas (como 0,5 e 3,75), utilizando a notação centesimal." },
      { codigo: "EF04MA06", serie: 4, area: "MA", unidade: "Grandezas e medidas", descricao: "Medir e estimar comprimentos (incluindo perímetros), massas e capacidades, utilizando unidades de medida padronizadas mais usuais." },
      { codigo: "EF04MA09", serie: 4, area: "MA", unidade: "Números", descricao: "Reconhecer as frações unitárias mais usuais (1/2, 1/3, 1/4, 1/5, 1/10 e 1/100) como unidades de medida menores do que uma unidade." },

      // ─── 4º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF04LP01", serie: 4, area: "LP", unidade: "Leitura", descricao: "Ler e compreender, com autonomia, textos de divulgação científica para crianças, identificando a ideia central do texto e relacionando informações." },
      { codigo: "EF04LP02", serie: 4, area: "LP", unidade: "Escrita", descricao: "Planejar e produzir textos sobre temas de interesse, com base em resultados de pesquisas em fontes de informação impressas ou digitais." },
      { codigo: "EF04LP03", serie: 4, area: "LP", unidade: "Análise Linguística", descricao: "Identificar a função e as flexões de verbos em textos, utilizando esses conhecimentos para melhorar as produções textuais." },
      { codigo: "EF04LP04", serie: 4, area: "LP", unidade: "Oralidade", descricao: "Produzir e ouvir textos orais de diferentes gêneros, como seminários, entrevistas, debates, entre outros, adequando a linguagem." },
      { codigo: "EF04LP05", serie: 4, area: "LP", unidade: "Leitura", descricao: "Inferir informações implícitas nos textos lidos, com base em elementos textuais e contextuais." },

      // ─── 4º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF04HI01", serie: 4, area: "HI", unidade: "Transformações e permanências", descricao: "Reconhecer a noção de espaço público e privado, distinguindo as esferas da vida pública e da vida privada ao longo da história." },
      { codigo: "EF04HI02", serie: 4, area: "HI", unidade: "Transformações e permanências", descricao: "Identificar mudanças e permanências ao longo do tempo, discutindo os significados das transformações e permanências em diferentes épocas e lugares." },
      { codigo: "EF04HI03", serie: 4, area: "HI", unidade: "Transformações e permanências", descricao: "Identificar as transformações ocorridas nos meios de comunicação e discutir seus significados para os diferentes grupos ou estratos sociais." },
      { codigo: "EF04HI04", serie: 4, area: "HI", unidade: "Transformações e permanências", descricao: "Identificar as relações entre os indivíduos e a natureza e discutir o significado do nomadismo e do sedentarismo para a formação das sociedades." },

      // ─── 4º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF04GE01", serie: 4, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Selecionar, em seus lugares de vivência, elementos de distintas culturas (indígenas, afrobrasileiras, europeias, etc.), valorizando o que é próprio em cada uma delas." },
      { codigo: "EF04GE02", serie: 4, area: "GE", unidade: "Conexões e escalas", descricao: "Descrever processos migratórios e suas contribuições para a formação da sociedade brasileira." },
      { codigo: "EF04GE03", serie: 4, area: "GE", unidade: "Mundo do trabalho", descricao: "Distinguir funções e papéis dos órgãos do poder público municipal e canais de participação social na gestão do município." },
      { codigo: "EF04GE04", serie: 4, area: "GE", unidade: "Natureza, ambientes e qualidade de vida", descricao: "Identificar as características das paisagens naturais e antrópicas no ambiente em que vive, bem como a ação humana na conservação ou degradação." },

      // ─── 4º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF04CI01", serie: 4, area: "CI", unidade: "Matéria e energia", descricao: "Identificar misturas na vida diária, com base em suas propriedades físicas observáveis, reconhecendo sua composição." },
      { codigo: "EF04CI02", serie: 4, area: "CI", unidade: "Matéria e energia", descricao: "Testar e relatar transformações nos materiais do dia a dia quando expostos a diferentes condições (aquecimento, resfriamento, luz e umidade)." },
      { codigo: "EF04CI03", serie: 4, area: "CI", unidade: "Vida e evolução", descricao: "Analisar e construir cadeias alimentares simples, reconhecendo a posição ocupada pelos seres vivos nessas cadeias e o papel do Sol como fonte primária de energia." },
      { codigo: "EF04CI04", serie: 4, area: "CI", unidade: "Terra e Universo", descricao: "Identificar os pontos cardeais, com base no registro de diferentes posições relativas do Sol e da sombra de uma vara (gnômon)." },

      // ─── 5º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF05MA01", serie: 5, area: "MA", unidade: "Números", descricao: "Ler, escrever e ordenar números naturais acima de 1000, com compreensão das principais características do sistema de numeração decimal." },
      { codigo: "EF05MA02", serie: 5, area: "MA", unidade: "Números", descricao: "Ler, escrever e ordenar números racionais na forma decimal com compreensão das principais características do sistema de numeração decimal." },
      { codigo: "EF05MA03", serie: 5, area: "MA", unidade: "Números", descricao: "Identificar e representar frações (menores e maiores que a unidade), reconhecendo e produzindo diferentes representações fracionárias de um mesmo número racional." },
      { codigo: "EF05MA04", serie: 5, area: "MA", unidade: "Números", descricao: "Identificar frações equivalentes e simplificar frações, utilizando a multiplicação e a divisão." },
      { codigo: "EF05MA05", serie: 5, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas envolvendo a adição e a subtração de números racionais expressos na forma decimal." },
      { codigo: "EF05MA06", serie: 5, area: "MA", unidade: "Álgebra", descricao: "Registrar com expressão matemática a regularidade observada em sequências de números, figuras e objetos." },
      { codigo: "EF05MA19", serie: 5, area: "MA", unidade: "Grandezas e medidas", descricao: "Resolver e elaborar problemas envolvendo medidas das grandezas comprimento, área, massa, tempo, temperatura e capacidade." },

      // ─── 5º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF05LP01", serie: 5, area: "LP", unidade: "Leitura", descricao: "Identificar o tema e a argumentação central de textos de opinião, distinguindo fatos de opiniões." },
      { codigo: "EF05LP02", serie: 5, area: "LP", unidade: "Escrita", descricao: "Planejar e produzir, com autonomia, textos de diferentes gêneros e finalidades, considerando a situação comunicativa e a estrutura composicional." },
      { codigo: "EF05LP03", serie: 5, area: "LP", unidade: "Análise Linguística", descricao: "Identificar e usar adequadamente a concordância nominal e verbal em textos produzidos." },
      { codigo: "EF05LP04", serie: 5, area: "LP", unidade: "Oralidade", descricao: "Argumentar oralmente sobre temas polêmicos, respeitando diferentes pontos de vista e apresentando propostas e justificativas." },
      { codigo: "EF05LP05", serie: 5, area: "LP", unidade: "Leitura", descricao: "Inferir e justificar, por meio de nota de rodapé, o significado de palavras ou expressões desconhecidas em textos." },
      { codigo: "EF05LP15", serie: 5, area: "LP", unidade: "Leitura", descricao: "Ler/assistir e compreender, com autonomia, notícias, reportagens, vídeos em vlogs argumentativos, dentre outros gêneros do jornalismo." },

      // ─── 5º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF05HI01", serie: 5, area: "HI", unidade: "Povos e culturas", descricao: "Identificar os processos de formação das culturas e dos povos, relacionando-os com o espaço geográfico ocupado." },
      { codigo: "EF05HI02", serie: 5, area: "HI", unidade: "Povos e culturas", descricao: "Identificar os mecanismos e as dinâmicas de comércio e de intercâmbio cultural entre os povos da Antiguidade e da Idade Média." },
      { codigo: "EF05HI03", serie: 5, area: "HI", unidade: "Povos e culturas", descricao: "Analisar o papel das culturas e das religiões na composição das sociedades do Novo Mundo." },
      { codigo: "EF05HI04", serie: 5, area: "HI", unidade: "Povos e culturas", descricao: "Identificar as principais características dos processos de formação do Brasil colonial, incluindo a chegada dos europeus e a resistência dos povos originários." },

      // ─── 5º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF05GE01", serie: 5, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Descrever e analisar dinâmicas populacionais na UF em que vive, estabelecendo relações entre migrações e condições de infraestrutura." },
      { codigo: "EF05GE02", serie: 5, area: "GE", unidade: "Conexões e escalas", descricao: "Identificar as formas de representação cartográfica do Brasil e do mundo, reconhecendo a importância da escala, da legenda e da orientação nos mapas." },
      { codigo: "EF05GE03", serie: 5, area: "GE", unidade: "Mundo do trabalho", descricao: "Mapear os usos do solo (residencial, comercial, industrial, serviços, lazer etc.) na cidade ou no campo, identificando os agentes que os produzem." },
      { codigo: "EF05GE04", serie: 5, area: "GE", unidade: "Natureza, ambientes e qualidade de vida", descricao: "Distinguir características das regiões brasileiras (Norte, Nordeste, Centro-Oeste, Sudeste e Sul) com base em aspectos naturais, culturais e econômicos." },

      // ─── 5º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF05CI01", serie: 5, area: "CI", unidade: "Matéria e energia", descricao: "Explorar fenômenos da vida cotidiana que evidenciem propriedades dos materiais (esticamento, dobramento, dureza, absorção de água, brilho, flexibilidade etc.)." },
      { codigo: "EF05CI02", serie: 5, area: "CI", unidade: "Matéria e energia", descricao: "Aplicar os conhecimentos sobre as mudanças de estado físico da água para explicar o ciclo hidrológico e analisar suas implicações." },
      { codigo: "EF05CI03", serie: 5, area: "CI", unidade: "Vida e evolução", descricao: "Selecionar argumentos que justifiquem por que os sistemas digestório e respiratório são considerados corresponsáveis pelo processo de nutrição do organismo." },
      { codigo: "EF05CI04", serie: 5, area: "CI", unidade: "Terra e Universo", descricao: "Identificar os planetas do Sistema Solar, suas características e os movimentos de rotação e translação, relacionando-os com a ocorrência de dias, noites e estações do ano." },

      // ─── 6º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF06MA01", serie: 6, area: "MA", unidade: "Números", descricao: "Comparar, ordenar, ler e escrever números naturais e números racionais cuja representação decimal é finita, fazendo uso da reta numérica." },
      { codigo: "EF06MA03", serie: 6, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas que envolvam cálculos (adição, subtração, multiplicação, divisão, potenciação) com números naturais." },
      { codigo: "EF06MA07", serie: 6, area: "MA", unidade: "Números", descricao: "Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão." },
      { codigo: "EF06MA15", serie: 6, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas que envolvam a partilha de uma quantidade em duas partes desiguais, envolvendo relações aditivas e multiplicativas." },
      { codigo: "EF06MA24", serie: 6, area: "MA", unidade: "Grandezas e medidas", descricao: "Resolver e elaborar problemas que envolvam as grandezas comprimento, massa, tempo, temperatura, área, capacidade e volume." },

      // ─── 6º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF06LP01", serie: 6, area: "LP", unidade: "Leitura", descricao: "Reconhecer a impossibilidade de uma neutralidade absoluta no relato de fatos e identificar diferentes graus de parcialidade/imparcialidade em textos noticiosos." },
      { codigo: "EF06LP04", serie: 6, area: "LP", unidade: "Análise Linguística", descricao: "Analisar a função e as flexões de substantivos e adjetivos e de verbos nos modos Indicativo, Subjuntivo e Imperativo: afirmativo e negativo." },
      { codigo: "EF67LP28", serie: 6, area: "LP", unidade: "Leitura", descricao: "Ler, de forma autônoma, romances infanto-juvenis, contos de fadas, contos de assombração, poemas visuais, entre outros, valorizando a literatura." },
      { codigo: "EF69LP01", serie: 6, area: "LP", unidade: "Leitura", descricao: "Diferenciar liberdade de expressão de discursos de ódio, posicionando-se contrariamente a esse tipo de discurso e vislumbrando possibilidades de denúncia." },

      // ─── 6º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF06HI01", serie: 6, area: "HI", unidade: "História: tempo, espaço e formas de registros", descricao: "Identificar diferentes formas de compreensão da noção de tempo e de periodização dos processos históricos (continuidades e rupturas)." },
      { codigo: "EF06HI02", serie: 6, area: "HI", unidade: "História: tempo, espaço e formas de registros", descricao: "Identificar a gênese da produção do saber histórico e analisar o significado das fontes que originaram determinadas formas de registro." },
      { codigo: "EF06HI07", serie: 6, area: "HI", unidade: "A invenção do mundo clássico", descricao: "Identificar aspectos e formas de registro das sociedades antigas na África, no Oriente Médio e nas Américas, distinguindo alguns significados presentes na cultura material e imaterial." },
      { codigo: "EF06HI14", serie: 6, area: "HI", unidade: "Lógicas de organização política", descricao: "Explicar a formação da Grécia Antiga, com ênfase na formação da pólis e nas transformações políticas, sociais e culturais." },

      // ─── 6º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF06GE01", serie: 6, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Comparar modificações das paisagens nos lugares de vivência e os usos desses lugares em diferentes tempos." },
      { codigo: "EF06GE02", serie: 6, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Analisar modificações de paisagens por diferentes tipos de sociedade, com destaque para os povos originários." },
      { codigo: "EF06GE08", serie: 6, area: "GE", unidade: "Formas de representação", descricao: "Medir distâncias na superfície pelas escalas gráficas e numéricas dos mapas." },
      { codigo: "EF06GE11", serie: 6, area: "GE", unidade: "Natureza, ambientes e qualidade de vida", descricao: "Analisar as consequências, sobre as paisagens, das atividades humanas na bacia hidrográfica em que o município está inserido." },

      // ─── 6º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF06CI01", serie: 6, area: "CI", unidade: "Matéria e energia", descricao: "Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais (água e sal, água e óleo, água e areia etc.)." },
      { codigo: "EF06CI02", serie: 6, area: "CI", unidade: "Matéria e energia", descricao: "Identificar evidências de transformações químicas a partir do resultado de misturas de materiais que originam produtos diferentes dos iniciais." },
      { codigo: "EF06CI05", serie: 6, area: "CI", unidade: "Vida e evolução", descricao: "Explicar a organização básica das células e seu papel como unidade estrutural e funcional dos seres vivos." },
      { codigo: "EF06CI11", serie: 6, area: "CI", unidade: "Terra e Universo", descricao: "Identificar as diferentes camadas que estruturam o planeta Terra (da estrutura interna à atmosfera) e suas principais características." },

      // ─── 7º ANO – MATEMÁTICA ───────────────────────────────────────────────
      { codigo: "EF07MA01", serie: 7, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e de múltiplo, podendo incluir máximo divisor comum ou mínimo múltiplo comum." },
      { codigo: "EF07MA04", serie: 7, area: "MA", unidade: "Números", descricao: "Resolver e elaborar problemas que envolvam operações com números inteiros." },
      { codigo: "EF07MA13", serie: 7, area: "MA", unidade: "Álgebra", descricao: "Compreender a ideia de variável, representada por letra ou símbolo, para expressar relação entre duas grandezas, diferenciando-a da ideia de incógnita." },
      { codigo: "EF07MA18", serie: 7, area: "MA", unidade: "Álgebra", descricao: "Resolver e elaborar problemas que possam ser representados por equações polinomiais de 1º grau, redutíveis à forma ax + b = c." },
      { codigo: "EF07MA29", serie: 7, area: "MA", unidade: "Grandezas e medidas", descricao: "Resolver e elaborar problemas que envolvam medidas de grandezas inseridos em contextos oriundos de situações cotidianas ou de outras áreas do conhecimento." },

      // ─── 7º ANO – LÍNGUA PORTUGUESA ───────────────────────────────────────
      { codigo: "EF07LP04", serie: 7, area: "LP", unidade: "Análise Linguística", descricao: "Reconhecer, em textos, o verbo como o núcleo das orações." },
      { codigo: "EF07LP07", serie: 7, area: "LP", unidade: "Análise Linguística", descricao: "Identificar, em textos lidos ou de produção própria, a estrutura básica da oração: sujeito, verbo, complementos." },
      { codigo: "EF67LP08", serie: 7, area: "LP", unidade: "Leitura", descricao: "Identificar os efeitos de sentido devidos à escolha de imagens estáticas, sequenciação ou sobreposição de imagens, definição de figura/fundo e ângulo." },
      { codigo: "EF69LP07", serie: 7, area: "LP", unidade: "Escrita", descricao: "Produzir textos em diferentes gêneros, considerando sua adequação ao contexto de produção e circulação." },

      // ─── 7º ANO – HISTÓRIA ────────────────────────────────────────────────
      { codigo: "EF07HI01", serie: 7, area: "HI", unidade: "O mundo moderno e a conexão entre sociedades", descricao: "Explicar o significado de 'modernidade' e suas lógicas de inclusão e exclusão, com base em uma concepção europeia." },
      { codigo: "EF07HI02", serie: 7, area: "HI", unidade: "O mundo moderno e a conexão entre sociedades", descricao: "Identificar conexões e interações entre as sociedades do Novo Mundo, da Europa, da África e da Ásia no contexto das navegações." },
      { codigo: "EF07HI10", serie: 7, area: "HI", unidade: "A organização do poder", descricao: "Analisar as lógicas mercantis e o domínio europeu sobre os mares e o contraponto Oriental." },
      { codigo: "EF07HI13", serie: 7, area: "HI", unidade: "A emergência do capitalismo", descricao: "Caracterizar a ação dos europeus e suas lógicas mercantis visando ao domínio no mundo atlântico." },

      // ─── 7º ANO – GEOGRAFIA ───────────────────────────────────────────────
      { codigo: "EF07GE01", serie: 7, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Avaliar, por meio de exemplos extraídos dos meios de comunicação, ideias e estereótipos acerca das paisagens e da formação territorial do Brasil." },
      { codigo: "EF07GE02", serie: 7, area: "GE", unidade: "O sujeito e seu lugar no mundo", descricao: "Analisar a influência dos fluxos econômicos e populacionais na formação socioespacial do Brasil." },
      { codigo: "EF07GE06", serie: 7, area: "GE", unidade: "Conexões e escalas", descricao: "Discutir em que medida a produção, a circulação e o consumo de mercadorias provocam impactos ambientais e influem na distribuição de riquezas." },
      { codigo: "EF07GE09", serie: 7, area: "GE", unidade: "Formas de representação", descricao: "Interpretar e elaborar mapas temáticos e históricos, inclusive utilizando tecnologias digitais, com informações demográficas e econômicas." },

      // ─── 7º ANO – CIÊNCIAS ────────────────────────────────────────────────
      { codigo: "EF07CI01", serie: 7, area: "CI", unidade: "Matéria e energia", descricao: "Discutir a aplicação, ao longo da história, das máquinas simples e propor soluções e invenções para a realização de tarefas mecânicas cotidianas." },
      { codigo: "EF07CI02", serie: 7, area: "CI", unidade: "Matéria e energia", descricao: "Diferenciar temperatura, calor e sensação térmica nas diferentes situações de equilíbrio termodinâmico cotidianas." },
      { codigo: "EF07CI07", serie: 7, area: "CI", unidade: "Vida e evolução", descricao: "Caracterizar os principais ecossistemas brasileiros quanto à paisagem, à quantidade de água, ao tipo de solo, à disponibilidade de luz solar e à temperatura." },
      { codigo: "EF07CI12", serie: 7, area: "CI", unidade: "Terra e Universo", descricao: "Demonstrar que o ar é uma mistura de gases, identificando sua composição, e discutir fenômenos como a inversão térmica e destruição da camada de ozônio." }
    ],
    skipDuplicates: true,
  })
  console.log("Seed concluído!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
