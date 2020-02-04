import Sequelize, { Model } from 'sequelize'

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        number: Sequelize.STRING,
        cep: Sequelize.STRING,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Recipient
