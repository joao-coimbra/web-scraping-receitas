import requests
from bs4 import BeautifulSoup
from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)


@app.middleware('response')
async def add_cors_headers(request, response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Max-Age'] = '86400'


@app.route('/api/receita', methods=['OPTIONS'])
async def options(request):
    response = json({"status": "ok"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return response


@app.route('/api/receita', methods=['POST'])
async def receita(request):
    receita = request.json.get("search")
    res = get_receita(receita)
    if res:
        return json({**res, "status": True})
    else:
        return json({"message": f'Receita de {receita} não encontrada na base de dados de receitaria', "status": False}, status=500)


def get_receita(receita):
    # Fazer uma requisição para a página
    url = f"https://www.receiteria.com.br/receita/{receita.replace(' ', '-')}/"
    response = requests.get(url)

    # Criar o objeto BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    receita = {}

    # Buscar dados
    try:
        try:
            receita['img'] = soup.find(
                'div', attrs={'class': 'superimg'}).find('img')['src']
        except Exception:
            pass
        receita['nome'] = soup.find('h1').text.strip()
        [receita['rendimento'], receita['tempo']] = [x.text.strip() for x in soup.find(
            'div', {'class': 'info-recipe'}).find_all('span', limit=2)]
        receita['ingredientes'] = [x.text.strip() for x in soup.find(
            "div", attrs={"class": "ingredientes"}).find_all("label")]

        try:
            receita['modo_preparo'] = [x.text.strip() for x in soup.find(
                "ol", attrs={"class": "lista-preparo-1"}).find_all("span")]
        except Exception:
            receita['modo_preparo'] = [x.text.strip() for x in soup.find("div", attrs={
                "class": "preparo"}).find("ol", attrs={"class": "noimg"}).find_all("li")]
        receita['dicas'] = [x.text.strip() for x in soup.find(
            "div", attrs={"class": 'infosadicionais'}).find_all("p")]
    except Exception:
        return False

    return receita


if __name__ == '__main__':
    app.run(debug=True)
