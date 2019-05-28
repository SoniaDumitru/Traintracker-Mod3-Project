class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.text :content
      t.integer :train_id
      t.integer :station_id

      t.timestamps
    end
  end
end
