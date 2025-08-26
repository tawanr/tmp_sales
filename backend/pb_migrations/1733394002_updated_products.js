/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1108966215")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_3YKWWYZdwk` ON `products` (`label`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1108966215")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
