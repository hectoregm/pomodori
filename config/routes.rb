Rails.application.routes.draw do
  resources :tasks do
    resources :pomodori, except: [:edit, :update, :destroy]
  end
  root 'welcome#index'
end
