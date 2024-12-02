/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3245856272")

  // update collection data
  unmarshal({
    "name": "customers"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3245856272")

  // update collection data
  unmarshal({
    "name": "customer"
  }, collection)

  return app.save(collection)
})
