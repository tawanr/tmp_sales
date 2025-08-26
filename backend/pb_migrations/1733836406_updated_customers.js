/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3245856272")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_PXqSpSVyZp` ON `customers` (`name`)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1319514589",
    "max": 0,
    "min": 0,
    "name": "carRegistration",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3245856272")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // remove field
  collection.fields.removeById("text1319514589")

  return app.save(collection)
})
