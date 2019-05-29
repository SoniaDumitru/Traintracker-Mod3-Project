Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :lines, :station_lines, :stations, :trains, :comments
    end
  end
end
