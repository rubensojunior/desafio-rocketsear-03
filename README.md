<img alt="GoStack" src="https://storage.googleapis.com/golden-wind/bootcamp-gostack/header-desafios.png" />

<h1 align="center">
<br>
Rocketseat - GoStack 10 - Challenge 03
</h1>

<p align="center">
This project was created to solve a challenge requested by Rocketseat. 
Gostack is immersive training in technologies, react and react natively.</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

<hr />

## Features

- Features can be accessed by routes below.

- 💹 **Node Js** — A web framework for Node Js

### **Routes**

  #### - Users (/users)

  | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /users    | POST   | {name, email, password} | {/} |
| /users    | PUT    | {name, email, password} | JWT |

  #### - Repicients (/repicients)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /repicients    | POST   | {name, street, neighborhood, number, complement, state, city, cep} | JWT |
| /repicients/:id    | PUT    | {name, street, neighborhood, number, complement, state, city, cep} | JWT |

  #### - Sessions (/sessions)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /sessions    | POST  | {email, password} | {/} |


  #### - Deliverymans (/deliverymans)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /deliverymans    | GET  | {/} | JWT |
| /deliverymans    | POST  | {email,name } | JWT |
| /deliverymans/:id    | PUT  | {email, name, avatar_id } | JWT |
| /deliverymans/:id    | DELETE  | {/} | JWT |

#### - Delivery (/deliveries)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /deliveries    | GET  | {/} | JWT |
| /deliveries    | POST  | {product, repicient_id, deliveryman_id} | JWT |
| /deliveries/:id    | PUT  | {product, repicient_id, deliveryman_id, start_date, end_date, canceled_at} | JWT |
| /deliveries/:id    | DELETE  | {/} | JWT |

#### - Deliveryman Actions (/deliveryman/id/*)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /deliveryman/:id/delivered    | GET  | {/} | {/} |
| /deliveryman/:id/deliveries    | GET  | {/} | {/} |
| /deliveryman/:iddm/deliveries/:iddl    | PUT  | {start_date, end_date, signature_id} | JWT |

#### - Delivery Problems (/deliveries/problems)

   | Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /deliveries/problems    | GET  | {/} | JWT |
| /deliveries/:id/problems    | GET  | {/} | JWT |
| /deliveries/:id/problems    | POST  | {description} | JWT |

#### - Cancellation Delivery (/problem/:id/cancel-delivery)

| Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /problem/:id/cancel-delivery    | DELETE  | {/} | JWT |

#### - File (/files)

| Resource | Method | Params (JSON) | Headers |
| :---:      | :---:  |    :---:      |    :---: |
| /files   | POST  | {file} | JWT |


## Getting started

- Clone project > enter the project folder
- run `yarn`
- run `docker run --name dbimage -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`
- Acess postbird or another postgres manager and create db with any name. 
- Configure db credentials in src > config > database.js
- run `yarn sequelize db:migrate`
- run `yarn dev`

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) page for details.

---

Created with passion by me 👨🏻‍💻
