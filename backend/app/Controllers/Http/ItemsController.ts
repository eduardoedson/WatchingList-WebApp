import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import Item from 'App/Models/Item'
import CreateItem from 'App/Validators/CreateItemValidator'
import UpdateItem from 'App/Validators/UpdateItemValidator'

export default class ItemsController {
  public async index({ response }: HttpContextContract) {
    const items = await Item.all()
    return response.ok({ items })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateItem)

    const itemByName = await Item.findBy('name', payload.name)
    if (itemByName) throw new BadRequest('Item already exists', 409)

    const item = await Item.create(payload)
    return response.created({ item })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const item = await Item.findOrFail(id)
    await item.delete()
    return response.ok({})
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const item = await Item.findOrFail(id)
    const payload = await request.validate(UpdateItem)
    item.merge(payload).save()
    return response.ok({ item })
  }

  public async get({ request, response }) {
    const { category, waiting, completed } = request.params()
    const items = await Item.query()
      .where('category', category)
      .andWhere('waiting', waiting)
      .andWhere('completed', completed)
      .orderBy('name', 'asc')
    return response.ok({ items })
  }
}
