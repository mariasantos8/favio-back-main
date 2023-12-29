import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import { DateTime } from 'luxon'
import { md5 } from 'js-md5';

export default class UsuariosController {
  public async index({}: HttpContextContract) {
    return Usuario.all()
  }

   public async store({request,response}: HttpContextContract) {
    const {nome,cpf,senha} = request.body()
    const newUsuario={nome,cpf,senha}
    const novasenha=md5(senha)
    newUsuario.senha = novasenha
    Usuario.create(newUsuario)
    return response.status(201).send(newUsuario)
  }

  public async show({params,response}: HttpContextContract) {
     // retorna o objeto caso exista, senao retornar objeto vazio {}
  //funcao callback
  let USUARIOENCONTRADO=await Usuario.findByOrFail('id',params.id)
  if(USUARIOENCONTRADO ==undefined)
    return response.status(404)
  return USUARIOENCONTRADO
  }

  public async update({request,params,response}: HttpContextContract) {
    const {nome,cpf,senha}=request.body()
    let USUARIOENCONTRADO=await Usuario.findByOrFail('id',params.id)
    if(!USUARIOENCONTRADO)
      return response.status(404)
    USUARIOENCONTRADO.nome=nome
    USUARIOENCONTRADO.cpf=cpf
    USUARIOENCONTRADO.senha=senha

    await USUARIOENCONTRADO.save()
    await USUARIOENCONTRADO.merge({updatedAt:DateTime.local()}).save()
    return response.status(200).send(USUARIOENCONTRADO)

  }

  public async destroy({params,response}: HttpContextContract) {
    let USUARIOENCONTRADO=await Usuario.findByOrFail('id',params.id)
    if(!USUARIOENCONTRADO)
      return response.status(404)
    USUARIOENCONTRADO.delete()
    return response.status(204)
}
}