# Web Scraping Receitas API

API utilizada no [site](https://web-scraping-receitas.vercel.app) para busca de receitas utilizando o web scraping.

![License](https://img.shields.io/badge/license-MIT-green) ![Data da última versão](https://img.shields.io/badge/release%20date-march-blue)

## Table of Contents

-   [Resume](#pushpin-resume)
-   [Technology](#zap-technology)
-   [Endpoints](#round_pushpin-endpoints)
    1.   [Receita](#receita)
-   [Usage](#hammer_and_wrench-usage)
-   [Authors](#gem-authors)
-   [License](#scroll-license)

## :zap: Technology

Technology used within the project:

-   [Sanic](https://sanic.dev): Version ^19.6.0

## :round_pushpin: Endpoints

### Addition

Takes recipe and returns the infos.

```http
POST /api/receita
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `search`  | `string` | **Required**. recipe |

Request Body:

```json
{
  "search": "lasanha"
}
```

Response Body:

```json
{
	"img": "...",
	"nome": "Lasanha à bolonhesa sem glúten",
	"rendimento": "6 porções",
	"tempo": "55min",
	"ingredientes": [
		"100 gramas de farinha de arroz",
		"3 gramas de goma xantana",
    "..."
  ],
	"modo_preparo": [
		"Prepare o molho bolonhesa da forma que desejar e reserve.",
		"Em uma tigela, misture a farinha de arroz, o polvilho doce, a fécula de batata, a goma xantana e o sal.",
		"Adicione o ovo e o azeite, misturando bem.",
		"..."
	],
	"dicas": ["..."],
	"status": true
}
```

---

## :hammer_and_wrench: Usage

To use this API, you can send HTTP requests to the appropriate endpoints. For example, to get a recipe, you can send a ***POST*** request to the _/api/receita_ endpoint with a JSON body like this:

```json
{
  "search": "cream cheese"
}
```

And the API will respond with a JSON body like this:

```json
{
	"nome": "Cream cheese",
	"rendimento": "4 porções",
	"tempo": "30min",
	"ingredientes": [
		"1 litro de leite integral pasteurizado",
		"3 colheres de sopa de vinagre branco",
		"50 gramas de manteiga sem sal (em ponto de pomada)",
		"200 gramas de creme de leite (com mais de 20% de gordura)",
		"1\/2 colher de chá de sal"
	],
	"modo_preparo": [
		"Reúna todos os ingredientes;",
		"Em uma panela, coloque o leite e leve ao fogo alto;",
		"Assim que começar a ferver, diminua o fogo, adicione o vinagre e fique mexendo;",
		"Assim que começar a talhar, desligue o fogo e espere terminar de talhar completamente;",
		"Passe esse leite por um pano, fechando e apertando bem, para retirar todo o soro;",
		"Transfira o leite talhado para um liquidificador, sem o soro, acrescente o restante dos ingredientes e bata até formar um creme liso e homogêneo;",
		"Despeje em um recipiente, tampe e leve para a geladeira por no mínimo 6 horas;",
		"Agora é só servir. Bom apetite!"
	],
	"dicas": [
		"Incremente o seu cream chesse adicionando ervas finas para uma versão aromatizado.\nE caso queira, o vinagre branco pode ser substituído por 3 colheres de sopa de suco de limão.\nÉ essencial que o leite usado seja o de saquinho, por ser somente o leite puro, sem os conservantes que existem nos leites de caixinha. Assim, o leite talha mais facilmente e seu cream cheese fica ainda mais saboroso.\nMas se acontecer de o leite não talhar o suficiente, adicione mais vinagre até ficar claramente talhado.\nO cream cheese pode durar até 7 dias na geladeira em um recipiente fechado."
	],
	"status": true
}
```

## :gem: Authors

[![name](https://avatars.githubusercontent.com/u/61300191?s=80&v=4)](https://github.com/joao-coimbra)
[![name](https://avatars.githubusercontent.com/u/64169738?s=80&v=4)](https://github.com/alvarezfelipe)
[![name](https://avatars.githubusercontent.com/u/126487510?s=80)](https://github.com/thiagoRocha534)

## :scroll: License

This project is licensed under the terms of the [MIT](https://choosealicense.com/licenses/mit/) license.
