const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");
const newInventoryId = uuidv4();

exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving inventories: ${err}`)
    );
};

exports.inventoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoriesData = await knex("inventories").where("id", id);

    res.status(200).json({ inventoriesData });
  } catch (err) {
    res.status(400).send(`Error retrieving data: ${err}`);
  }
};

exports.addInventory = (req, res) => {
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status
  ) {
    return res
      .status(400)
      .send(
        "Please provide warehouseid, itemname, description,category, status and quantity."
      );
  }

  knex("inventories")
    .insert({ ...req.body, id: newInventoryId })
    .then((_data) => {
      knex("inventories")
        .where({ id: newInventoryId })
        .then((data) => {
          res.status(201).json(data[0]);
        });
    })
    .catch((err) => res.status(400).send(`Error creating inventory:${err}`));
};
exports.updateInventory = (req, res) => {
  const obj = {
    id: req.body.id,
    warehouse_id: req.body.warehouse_id,
    item_name: req.body.item_name,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };
  knex("inventories")
    .update(obj)
    .where({ id: req.params.id })
    .then((_data) => {
      knex("inventories")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error updating Inventory ${req.params.id} ${err}`)
    );
};
// delete inventory by id

exports.deleteInventory = (req, res) => {
  knex("inventories")
    .delete()
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`inventory with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(400).send(`Error deleting Inventory ${req.params.id} ${err}`)
    );
};
