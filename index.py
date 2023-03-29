import requests
from bs4 import BeautifulSoup


def get_receita(receita):
    # Fazer uma requisição para a página
    url = f"https://www.receiteria.com.br/receita/{receita.replace(' ', '-')}/"
    response = requests.get(url)

    # Criar o objeto BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    receita = {}

    try:
        # Buscar dados
        receita['nome'] = soup.find('h1').text.strip()
        [receita['rendimento'], receita['tempo']] = [x.text.strip() for x in soup.find('div', {'class': 'info-recipe'}).find_all('span', limit=2)]
        receita['ingredientes'] = [x.text.strip() for x in soup.find("div", attrs={"class": "ingredientes"}).find_all("label")]
        receita['modo_preparo'] = [x.text.strip() for x in soup.find("ol", attrs={"class": "lista-preparo-1"}).find_all("span")]
        receita['dicas'] = [x.text.strip() for x in soup.find("div", attrs={"class": 'infosadicionais'}).find_all("p")]
        
        return receita
    except Exception:
        raise Exception('Possivelmente essa receita não está na base de dados, tente outra.')
    

def write_receita(receita):

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

    print('Arquivo salvo em /receita.md')


if __name__ == '__main__':
    receita = get_receita(input('Escolha uma receita: '))
    write_receita(receita)