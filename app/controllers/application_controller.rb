class ApplicationController < ActionController::Base
  around_filter :time_zone
  protect_from_forgery with: :exception

  def time_zone(&block)
    # TODO: When adding users use the user prefered time zone
    # instead of this hard coded zone.
    Time.use_zone('America/Mexico_City', &block)
  end

  private

  def destroy_record(record)
    record.destroy
    respond_to do |format|
      format.html { redirect_to url_for(record), notice: "#{record.model_name.name} was successfully destroyed." }
      format.json { head :no_content }
    end
  end
end
