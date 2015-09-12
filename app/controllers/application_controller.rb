class ApplicationController < ActionController::Base
  around_filter :time_zone
  protect_from_forgery with: :exception

  def time_zone(&block)
    # TODO: When adding users use the user prefered time zone
    # instead of this hard coded zone.
    Time.use_zone('America/Mexico_City', &block)
  end

  private

  def destroy_record(record, redirect_url = nil)
    record.destroy
    respond_to do |format|
      format.html do
        redirect_url = url_for(record) unless redirect_url
        redirect_to redirect_url, notice: "#{record.model_name.name} was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end
end
