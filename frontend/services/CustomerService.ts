import pb from "@/utils/pocketbase";

export type Customer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  deliveryService: string;
  deliveryNote: string;
};

export async function getCustomers(search: string = ""): Promise<Customer[]> {
  let filters = {};
  if (search) {
    filters = {
      filter: `name ~ '${search}' || phone ~ '${search}' || address ~ '${search}'`,
    };
  }
  const customers = await pb.collection("customers").getList<Customer>(1, 10, filters);
  return customers.items;
}
