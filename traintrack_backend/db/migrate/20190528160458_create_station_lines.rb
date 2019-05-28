class CreateStationLines < ActiveRecord::Migration[5.2]
  def change
    create_table :station_lines do |t|
      t.integer :line_id
      t.integer :station_id

      t.timestamps
    end
  end
end
