
let data = [];
function transformToHtml(arrayDeUsers) {
  const usersHtml = arrayDeUsers.map((user, index) => {
    return card(user) // user.Nome; user.cpf; user.dataNascimento
  }).join("");

  console.log(usersHtml)

  return usersHtml;
}

function formulario(arrayDeUsers) {


  return ` <form id="myForm"class="max-w-sm mx-auto">
    <div class="mb-5">
      <label for="large-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
      <input type="text" id="large-input-nome" name="nome" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div class="mb-5">
      <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de Nascimento</label>
      <input type="date" id="base-input-data" name="dataNascimento" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div>
      <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
      <input type="text" id="small-input-cpf" name="cpf" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
              <button type="button" id="submitButton" class="mt-5 bg-blue-500 text-white p-2 rounded">Enviar</button>

  </form>
  
`;
}

async function updateUI() {
  data = await carregarPessoas();
  const resultado = document.getElementById("result");

  console.log(data);

  if (data) {
    resultado.innerHTML = transformToHtml(data);
  }
}

(async () => {
  await updateUI();
  await botaoDelete()
})();

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  container.innerHTML = formulario();

  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", async () => {await apiForms()
window.location.reload(true);
  
  });
});

async function apiForms() {
  try {
    // const form = document.getElementById("myForm");
    const nome = document.getElementById("large-input-nome").value;
    const dataNascimento = document.getElementById("base-input-data").value;
    const cpf = document.getElementById("small-input-cpf").value;

    console.log(nome, dataNascimento, cpf);
    const formData = {
      nome,
      dataNascimento,
      cpf,
    };

    const response = await fetch(
      "https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/CreateOrUpdatePessoa",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(formData)
    console.log(response);
    if (response.ok) {
      const pessoa = await response.json();
      console.log("sucesso", pessoa);
      imprimir(pessoa);
    } else {
      console.error("Erro", response.statusText);
    }
  } catch (error) {
    console.error("erro", error);
  }
}

function card(user){
return`
  <div class="card" data-id="${user.Id}">
  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Pessoa Adicionada</h3>
  <p><strong>Nome:</strong> ${user.Nome || "Nome n existe"}</p>
  <p><strong>Data de Nascimento:</strong> ${user.DataNascimento || "nao existe"}</p>
  <p><strong>CPF:</strong> ${user.CPF || "nao existe"}</p>
  <button class='btn-delete w-50 h-50 px-4 py-2 bg-red-600 text-white'>Delete</button>
  </div>
`;
}



function imprimir(pessoa) {

  if (pessoa && pessoa.nome && pessoa.dataNascimento && pessoa.cpf) {
    resultado.innerHTML = `<h3 class="text-lg font-medium text-gray-900 dark:text-white">Pessoa Adicionada</h3>
      <p><strong>Nome:</strong> ${pessoa.nome || "Nome n existe"}</p>
      <p><strong>Data de Nascimento:</strong> ${pessoa.dataNascimento}</p>
      <p><strong>CPF:</strong> ${pessoa.cpf}</p>`;
  } else {
    
    exibirErro(); 
    
  }
}

function exibirErro() {
  const resultado = document.getElementById("result");
  resultado.innerHTML = `<h3 class="text-lg font-medium text-gray-900 dark:text-white">Erro ao receber dados</h3>
    <p>Os dados da pessoa não foram recebidos corretamente.</p>`;
}

 

async function carregarPessoas(){
  const url = await fetch("https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/Pessoas");
  
  if(!url.ok){
    throw new error('erro na aquisição:' + url.status)
  }

  const pessoas = await url.json();

  console.log(pessoas);
  return pessoas;
}

async function deletePessoa(Id){
  try{
    const resposta = await fetch(`https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/DeletePessoaById?PessoaId=${Id}`,{
      
      method: "DELETE"

    });

    if(!resposta.ok){
      throw new Error('houve um erro')
    }

    // const dadosResposta = resposta.json();
    // console.log(dadosResposta)

  }catch(error){
    console.log(error)
  }
}

async function botaoDelete(){
  const botoes = document.querySelectorAll('.btn-delete')

  botoes.forEach(botao => {
    botao.addEventListener('click', async function(e){
      const id = e.target.parentElement.dataset.id;
      await deletePessoa(id).then(async () => {
        await updateUI();
        window.location.reload(true);

      });
    })
  })
}