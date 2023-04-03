import requests
from sanic import Sanic
from sanic.response import json
from cors import add_cors_headers
from options import setup_options
from bs4 import BeautifulSoup

app = Sanic(__name__)

# @app.middleware('response')
# async def add_cors_headers(request, response):
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
#     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
#     response.headers['Access-Control-Max-Age'] = '86400'

app.static('/receita', 'static/receita.txt', name='receita')

# CORS(app, origins=['*'], methods=['GET', 'POST'])
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

  # Add OPTIONS handlers to any route that is missing it
# app.register_listener(setup_options, "before_server_start")

# Fill in CORS headers
# app.register_middleware(add_cors_headers, "response")  

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
            receita['img'] = soup.find('div', attrs={'class': 'superimg'}).find('img')['src']
        except Exception:
            pass
        receita['nome'] = soup.find('h1').text.strip()
        [receita['rendimento'], receita['tempo']] = [x.text.strip() for x in soup.find('div', {'class': 'info-recipe'}).find_all('span', limit=2)]
        receita['ingredientes'] = [x.text.strip() for x in soup.find("div", attrs={"class": "ingredientes"}).find_all("label")]
        
        try:
            receita['modo_preparo'] = [x.text.strip() for x in soup.find("ol", attrs={"class": "lista-preparo-1"}).find_all("span")]
        except Exception:
            receita['modo_preparo'] = [x.text.strip() for x in soup.find("div", attrs={"class": "preparo"}).find("ol", attrs={"class": "noimg"}).find_all("li")]
        receita['dicas'] = [x.text.strip() for x in soup.find("div", attrs={"class": 'infosadicionais'}).find_all("p")]
    except Exception:
        return False

    return receita
    

def write_receita(receita):
    # Escrever no arquivo receita.md
    with open('static/receita.md', 'w', encoding='utf-8') as f:
        f.write('# {}\n\n'.format(receita['nome']))
        f.write('- {}\n'.format(receita['rendimento']))
        f.write('- {}\n'.format(receita['tempo']))

        f.write('\n## Ingredientes\n\n')
        for x in receita['ingredientes']:
            f.write(f'- {x}\n')

        f.write('\n## Modo de preparo\n\n')
        for index, x in enumerate(receita['modo_preparo']):
            f.write(f'{index+1}. {x}\n')

        f.write('\n## Dicas\n\n')
        f.write('\n'.join(receita['dicas']))

    with open('static/receita.txt', 'w', encoding='utf-8') as f:
        f.write('{}\n\n'.format(receita['nome']))
        f.write('- {}\n'.format(receita['rendimento']))
        f.write('- {}\n'.format(receita['tempo']))

        f.write('\nIngredientes\n\n')
        for x in receita['ingredientes']:
            f.write(f'- {x}\n')

        f.write('\nModo de preparo\n\n')
        for index, x in enumerate(receita['modo_preparo']):
            f.write(f'{index+1}. {x}\n')

        f.write('\nDicas\n\n')
        f.write('\n'.join(receita['dicas']))

    print('Arquivo salvo em static/receita.md e static/receita.txt')


if __name__ == '__main__':
    app.run()
    # receita = get_receita(input('Escolha uma receita: '))
    # if receita:
    #     write_receita(receita)
    # else:
    #     print('Possivelmente essa receita não está na base de dados, tente outra.')