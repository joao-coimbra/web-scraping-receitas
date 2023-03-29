import requests
from bs4 import BeautifulSoup

# Fazer uma requisição para a página
url = "https://www.receiteria.com.br/receita/macarrao-alho-e-oleo/"
response = requests.get(url)

# Criar o objeto BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

# Buscar dados
receita = {}
receita['nome'] = soup.find('h1').text.strip()
[receita['rendimento'], receita['tempo']] = [x.text.strip() for x in soup.find('div', {'class': 'info-recipe'}).find_all('span', limit=2)]
receita['ingredientes'] = [x.text.strip() for x in soup.find("div", attrs={"class": "ingredientes"}).find_all("label")]
receita['modo_preparo'] = [x.text.strip() for x in soup.find("ol", attrs={"class": "lista-preparo-1"}).find_all("span")]
receita['dicas'] = [x.text.strip() for x in soup.find("div", attrs={"class": 'infosadicionais'}).find_all("p")]

# Escrever no arquivo receita.md
with open('receita.md', 'w', encoding='utf-8') as f:
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
