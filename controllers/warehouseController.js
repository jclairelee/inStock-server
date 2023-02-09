const knex = require("knex")(require("../knexfile"));
const { v4:uuidv4 } =require("uuid");



exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    );
};

exports.inventoriesByWarehouseId = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoriesData = await knex("inventories").where("warehouse_id", id);

    res.status(200).json({ inventoriesData });
  } catch (err) {
    res.status(400).send(`Error retrieving data: ${err}`);
  }
};

exports.warehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouseData = await knex("warehouses").where("id", id);
    res.status(200).json({ warehouseData });
  } catch (err) {
    res.status(400).send(`Error retrieving data: ${err}`);
  }
};


exports.updateWarehouse = (req, res) => {
  const obj = {
    id: req.body.id,
    warehouse_name: req.body.warehouse_name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact_name: req.body.contact_name,
    contact_position: req.body.contact_position,
    contact_phone: req.body.contact_phone,
    contact_email: req.body.contact_email,
  };
  knex("warehouses")
    .update(obj)
    .where({ id: req.params.id })
    .then((_data) => {
      knex("warehouses")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.addWarehouse = (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide warehouse_name, address, city, country, contact_name, contact_position, contact_phone and contact_email fields in a request"
      );
  }

  const newWarehouseId = uuidv4();
  knex("warehouses")
    .insert({ ...req.body, id: newWarehouseId })
    .then((_data) => {
      knex("warehouses")
        .where({ id: newWarehouseId })
        .then((data) => {
          res.status(201).json(data[0]);
        });
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};


// delete warehouse by id

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`Warehouse with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(400).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};





